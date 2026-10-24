/**
 * Icônes d'interface (Lucide, licence ISC), rendues en SVG au build. La
 * direction éditoriale n'utilise pas d'icônes décoratives : uniquement des
 * repères d'action et de navigation, et celles de la console du produit.
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
// Console LUXIA Identity (reconstitutions d'écrans)
import Activity from '@lucide/astro/icons/activity';
import Boxes from '@lucide/astro/icons/boxes';
import Building from '@lucide/astro/icons/building';
import CirclePause from '@lucide/astro/icons/circle-pause';
import CirclePlay from '@lucide/astro/icons/circle-play';
import ClipboardCheck from '@lucide/astro/icons/clipboard-check';
import Fingerprint from '@lucide/astro/icons/fingerprint-pattern';
import Gauge from '@lucide/astro/icons/gauge';
import KeyRound from '@lucide/astro/icons/key-round';
import Lock from '@lucide/astro/icons/lock';
import Scale from '@lucide/astro/icons/scale';
import ShieldCheck from '@lucide/astro/icons/shield-check';
import TriangleAlert from '@lucide/astro/icons/triangle-alert';
import UserPlus from '@lucide/astro/icons/user-plus';
import UserX from '@lucide/astro/icons/user-x';
import Users from '@lucide/astro/icons/users';

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
  'activity': Activity,
  'boxes': Boxes,
  'building': Building,
  'circle-pause': CirclePause,
  'circle-play': CirclePlay,
  'clipboard-check': ClipboardCheck,
  'fingerprint': Fingerprint,
  'gauge': Gauge,
  'key-round': KeyRound,
  'lock': Lock,
  'scale': Scale,
  'shield-check': ShieldCheck,
  'triangle-alert': TriangleAlert,
  'user-plus': UserPlus,
  'user-x': UserX,
  'users': Users,
} as const;

export type IconName = keyof typeof icons;
