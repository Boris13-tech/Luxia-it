import {allRoutes,site} from '@/lib/content';
import {locales,localizedPath,languageAlternates} from '@/lib/i18n';
export default function sitemap(){return locales.flatMap(locale=>['',...allRoutes].map(path=>({url:site.origin+localizedPath(locale,'/'+path),changeFrequency:'monthly' as const,priority:path?0.7:1,alternates:{languages:Object.fromEntries(Object.entries(languageAlternates('/'+path)).map(([l,p])=>[l,site.origin+p]))}})));}
