import fr from './messages/fr.json';
import en from './messages/en.json';
import zh from './messages/zh.json';
export const locales = ['fr', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export type MessageKey = keyof typeof fr;
const messages: Record<Locale, Record<string,string>> = {fr,en,zh};
export const isLocale = (value:string): value is Locale => locales.includes(value as Locale);
export function translator(locale:Locale) {return (key:MessageKey):string => messages[locale][key] ?? fr[key];}
export function localizedPath(locale:Locale, path:string) {
 if (!path.startsWith('/') || path.startsWith('//')) return path;
 const clean=path.replace(/^\/(fr|en|zh)(?=\/|$|#|\?)/,'');
 return '/'+locale+(clean==='/'?'':clean);
}
export function languageAlternates(path:string) {return {fr:localizedPath('fr',path), en:localizedPath('en',path), 'zh-CN':localizedPath('zh',path), 'x-default':localizedPath('fr',path)};}
