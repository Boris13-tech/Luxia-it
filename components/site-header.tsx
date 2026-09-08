'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
export const navigation = [
  ['Expertises', '/expertise'],
  ['Solutions', '/solutions'],
  ['Luxia Labs', '/labs'],
  ['Insights', '/insights'],
  ['Le groupe', '/company'],
];
export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Luxia-IT, accueil">
        <span className="logo-crop">
          <Image
            src="/luxia-logo.jpg"
            alt=""
            width={1086}
            height={1448}
            unoptimized
          />
        </span>
        LUXIA<span>-IT</span>
      </Link>
      <nav aria-label="Navigation principale">
        {navigation.map(([title, url]) => (
          <Link
            key={url}
            href={url}
            aria-current={path === url ? 'page' : undefined}
          >
            {title}
            {url === '/labs' && <i />}
          </Link>
        ))}
      </nav>
      <div className="header-end">
        <span className="locale" aria-label="Langue française">
          FR
        </span>
        <Link href="/contact" className="button small">
          Parlons de votre projet <span>↗</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="menu-toggle" aria-label="Ouvrir le menu">
            ☰
          </SheetTrigger>
          <SheetContent className="mobile-menu" showCloseButton={false}>
            <SheetTitle>LUXIA-IT</SheetTitle>
            <SheetDescription>Intelligence. Trust. Scale.</SheetDescription>
            <SheetClose className="menu-close" aria-label="Fermer le menu">
              ×
            </SheetClose>
            <nav aria-label="Navigation mobile">
              {[
                ...navigation,
                ['Secteurs', '/industries'],
                ['Projets', '/case-studies'],
                ['Contact', '/contact'],
              ].map(([title, url]) => (
                <Link key={url} href={url} onClick={() => setOpen(false)}>
                  {title}
                  <span>↗</span>
                </Link>
              ))}
            </nav>
            <p>AFRIQUE × EUROPE</p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
