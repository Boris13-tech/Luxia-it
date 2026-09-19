'use client';

import {createContext, useContext, useEffect, useRef, type ReactNode} from 'react';
import {usePathname, useRouter} from 'next/navigation';

const Navigation = createContext<((href:string, replace?:boolean, scroll?:boolean)=>void) | null>(null);
export const useRouteTransition = () => useContext(Navigation);

export default function RouteTransition({children}:{children:ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const watchdog = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const animation = useRef<Animation | null>(null);

  useEffect(() => {
    if (!pending.current || !curtain.current) return;
    clearTimeout(watchdog.current);
    pending.current = false;
    const panel = curtain.current;
    animation.current?.cancel();
    animation.current = panel.animate([{transform:'translateY(0)'},{transform:'translateY(-100%)'}], {
      duration:650, easing:'cubic-bezier(.76,0,.24,1)', fill:'forwards'
    });
    animation.current.finished.then(() => { panel.style.visibility='hidden'; }).catch(() => {});
  }, [pathname]);

  useEffect(() => () => {clearTimeout(watchdog.current); animation.current?.cancel();}, []);

  const navigate = async (href:string, replace=false, scroll=true) => {
    if (pending.current) return;
    const panel = curtain.current;
    if (!panel || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (replace) router.replace(href,{scroll}); else router.push(href,{scroll});
      return;
    }
    pending.current = true;
    panel.style.visibility='visible';
    animation.current?.cancel();
    animation.current = panel.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}], {
      duration:360, easing:'cubic-bezier(.76,0,.24,1)', fill:'forwards'
    });
    try { await animation.current.finished; } catch { return; }
    // A failed client navigation must never leave an opaque screen over the site.
    watchdog.current = setTimeout(() => { window.location.assign(href); }, 8000);
    if (replace) router.replace(href,{scroll}); else router.push(href,{scroll});
  };

  return <Navigation.Provider value={navigate}>{children}<div ref={curtain} className="route-curtain" aria-hidden="true"><span>LUXIA<span className="route-curtain-dot">.</span></span></div></Navigation.Provider>;
}
