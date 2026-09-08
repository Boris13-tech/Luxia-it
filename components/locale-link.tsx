'use client';
import NextLink from 'next/link';
import type {ComponentProps} from 'react';
import {useI18n} from './i18n-provider';
import {localizedPath} from '@/lib/i18n';
export default function Link({href,...props}:ComponentProps<typeof NextLink>){const {locale}=useI18n();return <NextLink {...props} href={typeof href==='string'?localizedPath(locale,href):href}/>;}
