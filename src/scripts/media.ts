/**
 * Vidéos produit : lecture automatique muette et en boucle, uniquement
 * lorsqu'elles sont visibles. Avec prefers-reduced-motion, aucune lecture
 * automatique : les contrôles sont affichés.
 */
export function initMedia(): void {
  const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]')];
  if (videos.length === 0) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && !reduce.matches) {
          video.play().catch(() => {
            video.controls = true;
          });
        } else {
          video.pause();
        }
      }
    },
    { threshold: 0.25 },
  );

  const apply = () => {
    for (const video of videos) {
      video.muted = true;
      video.controls = reduce.matches;
      if (reduce.matches) video.pause();
      observer.observe(video);
    }
  };

  apply();
  reduce.addEventListener('change', apply);
}
