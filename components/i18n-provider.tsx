'use client';
import {createContext,useContext,useMemo,type ReactNode} from 'react';
import {translator,type Locale} from '@/lib/i18n';
const Context=createContext<Locale>('fr');
export function I18nProvider({locale,children}:{locale:Locale;children:ReactNode}){return <Context.Provider value={locale}>{children}</Context.Provider>;}
export function useI18n(){const locale=useContext(Context);const t=useMemo(()=>translator(locale),[locale]);return {locale,t};}
