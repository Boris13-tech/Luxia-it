'use client';
import Image from 'next/image';
import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
const Scene = lazy(() => import('./nucleus-scene'));
function Fallback() {
  return (
    <Image
      className="nucleus-fallback"
      src="/luxia-logo.jpg"
      alt=""
      width={1086}
      height={1448}
      unoptimized
    />
  );
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}
export default function Nucleus({
  mode = 0,
  className = '',
}: {
  mode?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    let intersecting = false;
    const visibility = () => setVisible(intersecting && !document.hidden);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        visibility();
      },
      { rootMargin: '100px' },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  return (
    <figure
      ref={ref}
      className={'nucleus ' + className}
      aria-label="Structure Luxia : trois formes ascendantes au cœur d’un réseau intelligent"
    >
      <Boundary>
        {visible ? (
          <Suspense fallback={<Fallback />}>
            <Scene mode={mode} reduced={reduced} />
          </Suspense>
        ) : (
          <Fallback />
        )}
      </Boundary>
    </figure>
  );
}
