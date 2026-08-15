'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const menuRef = useRef(null);
  const pathname = usePathname();

  function toggleMenu() {
    if (menuRef.current) {
      menuRef.current.classList.toggle('open');
    }
  }

  const links = [
    { href: '/what-we-do', label: 'What we do' },
    { href: '/products', label: 'Products' },
    { href: '/consulting', label: 'Consulting' },
    { href: '/academy', label: 'Academy' },
    { href: '/industries', label: 'Industries' },
    { href: '/insights', label: 'Insights' },
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' },
  ];

  return (
    <header className="top">
      <div className="inner">
        <Link className="brand" href="/"><img src="/logo Luxia-IT.png" alt="Luxia-IT" style={{height:'24px',width:'auto'}} /></Link>
        <nav ref={menuRef}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="r">
          <span className="lang"><b>EN</b> / FR</span>
          <Link className="btn btn-primary" href="/contact">Talk to an expert</Link>
          <button className="mburger" type="button" onClick={toggleMenu}>Menu</button>
        </div>
      </div>
    </header>
  );
}
