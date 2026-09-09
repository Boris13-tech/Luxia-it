export const visualScenes = [
 {src:'/visuals/intelligence.webp',position:'50% 52%',credit:'Jason Leung',source:'https://unsplash.com/photos/j8Tc1rV-gUw'},
 {src:'/visuals/trust.webp',position:'48% 46%',credit:'Ricardo Gomez Angel',source:'https://unsplash.com/photos/black-glass-building-vqjTBXdydI0'},
 {src:'/visuals/cloud.webp',position:'50% 50%',credit:'Taylor Vick',source:'https://unsplash.com/photos/M5tzZtFCOfs'},
 {src:'/visuals/automation.webp',position:'65% 50%',credit:'Simon Kadula',source:'https://unsplash.com/photos/8gr6bObQLOI'},
 {src:'/visuals/world.webp',position:'78% 48%',credit:'NASA',source:'https://unsplash.com/photos/the-continents-and-oceans-with-clouds-gyp1xkjZNg8'},
];
export function sceneIndex(mode:number){return mode<0?1:mode===4?0:mode>=5?4:Math.min(3,Math.max(0,Math.round(mode)));}

