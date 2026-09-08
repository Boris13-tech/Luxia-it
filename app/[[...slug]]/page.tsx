import type {Metadata} from 'next';
import {notFound,permanentRedirect} from 'next/navigation';
import Home from '@/components/home';
import ContentPage from '@/components/content-page';
import {allRoutes,getContent} from '@/lib/content';
import {isLocale,locales,translator,localizedPath,languageAlternates} from '@/lib/i18n';
type Props={params:Promise<{slug?:string[]}>};
export function generateStaticParams(){return locales.flatMap(locale=>['',...allRoutes].map(path=>({slug:[locale,...(path?path.split('/'):[])]})));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug=[]}=await params;const locale=isLocale(slug[0])?slug[0]:'fr';const path=slug.slice(1).join('/');const t=translator(locale);const {services,articles,cases}=getContent(locale);
 const labels:Record<string,string>={expertise:t('m096'),solutions:t('m097'),industries:t('m098'),'case-studies':t('m099'),labs:'Luxia Labs',insights:'Luxia Insights',company:t('m100'),'company/careers':t('m101'),contact:t('m102'),privacy:t('m103'),legal:t('m104')};
 const item=services.find(s=>'expertise/'+s.slug===path)||articles.find(s=>'insights/'+s.slug===path)||cases.find(s=>'case-studies/'+s.slug===path);
 const title=item?.title||labels[path]||t('m257');const description=item?.intro||(path?title+' — '+t('m258'):t('m258'));const url=localizedPath(locale,'/'+path);
 return {title:{absolute:path?title+' | Luxia-IT':title},description,alternates:{canonical:url,languages:languageAlternates('/'+path)},openGraph:{title,description,url,siteName:'Luxia-IT',locale:{fr:'fr_FR',en:'en_GB',zh:'zh_CN'}[locale],alternateLocale:locales.filter(l=>l!==locale).map(l=>({fr:'fr_FR',en:'en_GB',zh:'zh_CN'}[l])),type:path.startsWith('insights/')?'article':'website'},twitter:{card:'summary',title,description}};
}
export default async function Page({params}:Props){const {slug=[]}=await params;if(!slug.length)permanentRedirect('/fr');if(!isLocale(slug[0])){if(allRoutes.includes(slug.join('/')))permanentRedirect('/fr/'+slug.join('/'));notFound();}const locale=slug[0];const path=slug.slice(1).join('/');if(path&&!allRoutes.includes(path))notFound();return path?<ContentPage locale={locale} path={path}/>:<Home locale={locale}/>;}
