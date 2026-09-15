'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

/** Native scrolling stays in charge; motion only reveals the content in its path. */
export default function PageMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const main = document.querySelector('main');
    if (!main || preference.matches) return;
    const animate = (element: Element, distance: number, duration: number) => {
      const animation = element.animate([
        {opacity: 0, transform: `translateY(${distance}px)`},
        {opacity: 1, transform: 'translateY(0)'},
      ], {duration, easing: 'cubic-bezier(.22,1,.36,1)'});
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => {});
    };
    const entrance = main.querySelector('.page-hero-copy, .v2-hero-copy, .expertise-editorial-copy');
    if (entrance && !location.hash) animate(entrance, 28, 750);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (!preference.matches) animate(entry.target, 32, 850);
      }
    }, {threshold: 0.08, rootMargin: '0px 0px -35px 0px'});
    main.querySelectorAll('section h2, .expertise-editorial-card, .solution-photo, .home-capabilities a, .sector-index article, .insights-index > a').forEach(element => {
      if (element.getBoundingClientRect().top > innerHeight) observer.observe(element);
    });
    const stop = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      preference.removeEventListener('change', stop);
    };
  }, [pathname]);
  return null;
}
