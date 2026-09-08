'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {locales,localizedPath} from '@/lib/i18n';
import {useI18n} from './i18n-provider';
export default function LanguageSelector({onSelect}:{onSelect?:()=>void}){const path=usePathname()||'/';const {locale,t}=useI18n();return <nav className="language-selector" aria-label={t('languageLabel')}>{locales.map(l=><Link key={l} href={localizedPath(l,path)} hrefLang={l==='zh'?'zh-CN':l} lang={l==='zh'?'zh-CN':l} aria-current={l===locale?'page':undefined} onClick={onSelect}>{l==='zh'?'中文':l.toUpperCase()}</Link>)}</nav>;}
