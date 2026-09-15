'use client';
import {useI18n} from '@/components/i18n-provider';
import Link from '@/components/locale-link';
import LanguageSelector from './language-selector';
import {localizedPath} from '@/lib/i18n';
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
export default function SiteHeader() {
const {t:tr,locale} = useI18n();
const labels = locale==='fr'
  ? ['Solutions','Expertises','Industries','Développeurs','Ressources','À propos']
  : locale==='en'
    ? ['Solutions','Expertise','Industries','Developers','Resources','About']
    : ['解决方案','专业能力','行业','开发者','资源','关于'];
const navigation = [
  [labels[0], '/solutions'],
  [labels[1], '/expertise'],
  [labels[2], '/industries'],
  [labels[3], '/labs'],
  [labels[4], '/insights'],
  [labels[5], '/company'],
];

  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label={tr('m264')}>
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
      <nav aria-label={tr('m265')}>
        {navigation.map(([title, url]) => (
          <Link
            key={url}
            href={url}
            aria-current={path === localizedPath(locale,url) ? 'page' : undefined}
          >
            {title}
            {url === '/labs' && <i />}
          </Link>
        ))}
      </nav>
      <div className="header-end">
        <LanguageSelector />
        <Link href="/contact" className="button small">
          {locale==='fr'?'Nous contacter':locale==='en'?'Contact us':'联系我们'}<span>↗</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger id="main-menu-trigger" className="menu-toggle" aria-label={tr('m268')}>
            ☰
          </SheetTrigger>
          <SheetContent className="mobile-menu" showCloseButton={false}>
            <SheetTitle>LUXIA-IT</SheetTitle>
            <SheetDescription>{tr('m269')}</SheetDescription>
            <SheetClose className="menu-close" aria-label={tr('m270')}>
              {tr('m012')}</SheetClose>
            <nav aria-label={tr('m271')}>
              {[
                ...navigation,
                [tr('m099'), '/case-studies'],
                [tr('m102'), '/contact'],
              ].map(([title, url]) => (
                <Link key={url} href={url} onClick={() => setOpen(false)}>
                  {title}
                  <span>↗</span>
                </Link>
              ))}
            </nav>
            <LanguageSelector onSelect={()=>setOpen(false)}/><p>{tr('m202')}</p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
