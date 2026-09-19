'use client';
import NextLink from 'next/link';
import type {ComponentProps} from 'react';
import {useI18n} from './i18n-provider';
import {localizedPath} from '@/lib/i18n';
import {useRouteTransition} from './route-transition';
export default function Link({href,onClick,...props}:ComponentProps<typeof NextLink>){
 const {locale}=useI18n(); const navigate=useRouteTransition();
 const destination=typeof href==='string'?localizedPath(locale,href):href;
 return <NextLink {...props} href={destination} onClick={event=>{
  onClick?.(event);
  if(event.defaultPrevented||!navigate||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||props.target&&props.target!=='_self'||props.download) return;
  const url=new URL(event.currentTarget.href,location.href);
  if(url.origin!==location.origin||url.pathname===location.pathname||url.hash) return;
  event.preventDefault(); navigate(url.pathname+url.search,props.replace,props.scroll);
 }}/>;
}
