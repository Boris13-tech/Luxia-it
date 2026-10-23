/**
 * Icônes d'interface (Lucide, licence ISC), rendues en SVG au build. La
 * direction éditoriale n'utilise pas d'icônes décoratives : uniquement des
 * repères d'action et de navigation.
 */
import ArrowDown from '@lucide/astro/icons/arrow-down';
import ArrowRight from '@lucide/astro/icons/arrow-right';
import ArrowUpRight from '@lucide/astro/icons/arrow-up-right';
import Check from '@lucide/astro/icons/check';
import ChevronRight from '@lucide/astro/icons/chevron-right';
import ExternalLink from '@lucide/astro/icons/external-link';
import Mail from '@lucide/astro/icons/mail';
import Menu from '@lucide/astro/icons/menu';
import Phone from '@lucide/astro/icons/phone';
import X from '@lucide/astro/icons/x';

export const icons = {
  'arrow-down': ArrowDown,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  check: Check,
  'chevron-right': ChevronRight,
  'external-link': ExternalLink,
  mail: Mail,
  menu: Menu,
  phone: Phone,
  x: X,
} as const;

export type IconName = keyof typeof icons;
