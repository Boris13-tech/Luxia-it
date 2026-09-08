import type {Metadata} from 'next';
import {Geist,Geist_Mono} from 'next/font/google';
import '../globals.css';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import {I18nProvider} from '@/components/i18n-provider';
import {site} from '@/lib/content';
import {isLocale,translator} from '@/lib/i18n';
const sans=Geist({variable:'--font-geist-sans',subsets:['latin']});
const mono=Geist_Mono({variable:'--font-geist-mono',subsets:['latin']});
export const metadata:Metadata={metadataBase:new URL(site.origin)};
export default async function RootLayout({children,params}:{children:React.ReactNode;params:Promise<{slug?:string[]}>}){
 const {slug=[]}=await params;const locale=isLocale(slug[0])?slug[0]:'fr';const t=translator(locale);
 return <html lang={locale==='zh'?'zh-CN':locale} className="dark"><body className={`${sans.variable} ${mono.variable}`}><I18nProvider key={locale} locale={locale}><a className="skip" href="#main">{t('m260')}</a><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:site.name,url:site.origin+'/'+locale,email:site.email,telephone:site.phone,description:t('m258'),founder:{'@type':'Person',name:site.founder}}).replace(/</g,'\\u003c')}}/><SiteHeader/>{children}<SiteFooter locale={locale}/></I18nProvider></body></html>;
}
