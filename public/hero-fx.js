import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

// =========================================================================
// CONFIGURATION DE LA SCÈNE (À AJUSTER LORS DE L'INTÉGRATION DU GLB)
// =========================================================================
const CONFIG = {
    MODEL_PATH: '/models/infrastructure-component.glb', // Prototype PCB (31 MB)
    
    // Auto-normalization target
    TARGET_SIZE: 12.0, // Taille normalisée de l'objet dans la scène
    MODEL_SCALE: 1.0, 
    MODEL_POSITION: { x: 4.5, y: -1.0, z: -2.0 },
    MODEL_ROTATION: { x: Math.PI / 16, y: -Math.PI / 7, z: 0 },
    
    CAMERA_FOV: 30, // Focal longue pour effet macro/studio
    CAMERA_POSITION: { x: 0, y: 1.5, z: 12 },
    
    // Profondeur de champ (Depth of Field)
    DOF_FOCUS_DISTANCE: 11.0, // Focus sur l'avant du PCB
    DOF_APERTURE: 0.00008,    
    DOF_MAXBLUR: 0.015,      
    
    // Éclairage & Environnement
    LIGHT_ENV_INTENSITY: 0.8,
    LIGHT_KEY_INTENSITY: 4.5,
    LIGHT_FILL_INTENSITY: 1.2,
    LIGHT_RIM_COBALT_INTENSITY: 12.0, 
    SHADOW_OPACITY: 0.6
};
// =========================================================================

let camera, scene, renderer, composer, bokehPass;
let modelGroup;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let scrollY = 0, targetScroll = 0;
let isReducedMotion = false;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

init();

function init() {
    const canvas = document.getElementById('hero-fx');
    if (!canvas) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', e => { isReducedMotion = e.matches; });

    // 1. Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance with post-processing
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Scene & Camera
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(CONFIG.CAMERA_FOV, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(CONFIG.CAMERA_POSITION.x, CONFIG.CAMERA_POSITION.y, CONFIG.CAMERA_POSITION.z);

    // 3. Environment & Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), CONFIG.LIGHT_ENV_INTENSITY).texture;

    setupLighting();

    // 4. Model Group & Shadow Catcher (Ground)
    modelGroup = new THREE.Group();
    modelGroup.position.set(CONFIG.MODEL_POSITION.x, CONFIG.MODEL_POSITION.y, CONFIG.MODEL_POSITION.z);
    modelGroup.rotation.set(CONFIG.MODEL_ROTATION.x, CONFIG.MODEL_ROTATION.y, CONFIG.MODEL_ROTATION.z);
    scene.add(modelGroup);

    setupShadowCatcher();

    // 5. Load GLTF (Production Ready Architecture)
    loadProductionModel();

    // 6. Post-Processing (Depth of Field)
    setupPostProcessing();

    // 7. Events
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onWindowResize);

    // 8. Start Loop
    canvas.classList.add('ready');
    renderer.setAnimationLoop(animate);
}

function setupLighting() {
    // Key Light (Main directional studio light casting soft shadows)
    const keyLight = new THREE.DirectionalLight(0xfff7eb, CONFIG.LIGHT_KEY_INTENSITY); // Slightly warm
    keyLight.position.set(5, 8, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill Light (Soft ambient lifting shadows)
    const fillLight = new THREE.DirectionalLight(0xe4e7f5, CONFIG.LIGHT_FILL_INTENSITY); // Slightly cool
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    // Rim Light (Cobalt accent hooking onto physical bevels)
    const rimLight = new THREE.SpotLight(0x0047ff, CONFIG.LIGHT_RIM_COBALT_INTENSITY);
    rimLight.position.set(8, 2, -5);
    rimLight.lookAt(0, 0, 0);
    rimLight.angle = Math.PI / 6;
    rimLight.penumbra = 1;
    scene.add(rimLight);
}

function setupShadowCatcher() {
    // Invisible plane that only receives shadows to anchor the object
    const planeGeo = new THREE.PlaneGeometry(20, 20);
    const shadowMat = new THREE.ShadowMaterial({ opacity: CONFIG.SHADOW_OPACITY });
    const ground = new THREE.Mesh(planeGeo, shadowMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0; // The GLB must be modeled to rest exactly on Y=0
    ground.receiveShadow = true;
    modelGroup.add(ground);
}

function loadProductionModel() {
    const loader = new GLTFLoader();
    loader.load(
        CONFIG.MODEL_PATH,
        (gltf) => {
            const model = gltf.scene;
            
            // Auto-normalisation
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetScale = (CONFIG.TARGET_SIZE || 10) / maxDim;
            model.scale.setScalar(targetScale * CONFIG.MODEL_SCALE);
            
            const scaledBox = new THREE.Box3().setFromObject(model);
            const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
            
            // Centrage absolu avec Y posé sur 0
            model.position.x -= scaledCenter.x;
            model.position.y -= scaledBox.min.y;
            model.position.z -= scaledCenter.z;
            
            // Enable physical shadows on all loaded meshes
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    if (node.material) {
                        node.material.roughness = 0.7; 
                        node.material.metalness = 0.3;
                        node.material.needsUpdate = true;
                    }
                }
            });
            modelGroup.add(model);
        },
        undefined,
        (error) => {
            console.log("En attente de l'asset 3D de production (infrastructure-component.glb). L'architecture de rendu est prête.");
        }
    );
}

function setupPostProcessing() {
    composer = new EffectComposer(renderer);
    
    const renderPass = new RenderPass(scene, camera);
    // Important: Keep transparent background through the pipeline
    renderPass.clearColor = new THREE.Color(0, 0, 0);
    renderPass.clearAlpha = 0;
    composer.addPass(renderPass);

    bokehPass = new BokehPass(scene, camera, {
        focus: CONFIG.DOF_FOCUS_DISTANCE,
        aperture: CONFIG.DOF_APERTURE,
        maxblur: CONFIG.DOF_MAXBLUR,
        width: window.innerWidth,
        height: window.innerHeight
    });
    composer.addPass(bokehPass);
}

function onDocumentMouseMove(event) {
    if (isReducedMotion) return;
    // Micro-parallax calculation
    mouseX = (event.clientX - windowHalfX) * 0.0002;
    mouseY = (event.clientY - windowHalfY) * 0.0002;
}

function onScroll() {
    if (isReducedMotion) return;
    targetScroll = window.scrollY * 0.0005;
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    composer.setSize(width, height);
    
    if(bokehPass) {
        bokehPass.renderTargetDepth.width = width;
        bokehPass.renderTargetDepth.height = height;
    }

    // Responsive framing
    if (width <= 960) {
        modelGroup.position.x = 0;
        modelGroup.position.y = CONFIG.MODEL_POSITION.y - 2.0;
        modelGroup.scale.setScalar(0.7);
    } else {
        modelGroup.position.x = CONFIG.MODEL_POSITION.x;
        modelGroup.position.y = CONFIG.MODEL_POSITION.y;
        modelGroup.scale.setScalar(1.0);
    }
}

function animate(time) {
    if (!isReducedMotion) {
        // Smooth camera inertia (Parallax)
        targetX = mouseX;
        targetY = mouseY;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY + CONFIG.CAMERA_POSITION.y - camera.position.y) * 0.05;
        
        // Scroll pushes camera up slightly, shifting perspective
        scrollY += (targetScroll - scrollY) * 0.1;
        camera.position.y += scrollY;
        
        camera.lookAt(scene.position);
    }

    // Render via composer for Depth of Field
    composer.render();
}