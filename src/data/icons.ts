/**
 * Catalogue des icônes du site (Lucide, licence ISC), rendues en SVG au build.
 * Pour en ajouter une : https://lucide.dev/icons, puis une ligne ci-dessous.
 */
import Activity from '@lucide/astro/icons/activity';
import ArrowLeftRight from '@lucide/astro/icons/arrow-left-right';
import ArrowUp from '@lucide/astro/icons/arrow-up';
import BadgeCheck from '@lucide/astro/icons/badge-check';
import Blocks from '@lucide/astro/icons/blocks';
import BookOpen from '@lucide/astro/icons/book-open';
import Briefcase from '@lucide/astro/icons/briefcase';
import Building from '@lucide/astro/icons/building';
import ChevronDown from '@lucide/astro/icons/chevron-down';
import ChevronRight from '@lucide/astro/icons/chevron-right';
import CircleCheck from '@lucide/astro/icons/circle-check';
import ClipboardCheck from '@lucide/astro/icons/clipboard-check';
import Cloud from '@lucide/astro/icons/cloud';
import Compass from '@lucide/astro/icons/compass';
import Database from '@lucide/astro/icons/database';
import Eye from '@lucide/astro/icons/eye';
import FileCheck from '@lucide/astro/icons/file-check';
import Fingerprint from '@lucide/astro/icons/fingerprint-pattern';
import FlaskConical from '@lucide/astro/icons/flask-conical';
import GitMerge from '@lucide/astro/icons/git-merge';
import GlobeLock from '@lucide/astro/icons/globe-lock';
import GraduationCap from '@lucide/astro/icons/graduation-cap';
import Handshake from '@lucide/astro/icons/handshake';
import KeyRound from '@lucide/astro/icons/key-round';
import Landmark from '@lucide/astro/icons/landmark';
import Layers from '@lucide/astro/icons/layers';
import LifeBuoy from '@lucide/astro/icons/life-buoy';
import Lightbulb from '@lucide/astro/icons/lightbulb';
import Lock from '@lucide/astro/icons/lock';
import LogIn from '@lucide/astro/icons/log-in';
import Mail from '@lucide/astro/icons/mail';
import MapPin from '@lucide/astro/icons/map-pin';
import Menu from '@lucide/astro/icons/menu';
import Microscope from '@lucide/astro/icons/microscope';
import MonitorCog from '@lucide/astro/icons/monitor-cog';
import Mouse from '@lucide/astro/icons/mouse';
import Network from '@lucide/astro/icons/network';
import Phone from '@lucide/astro/icons/phone';
import Plug from '@lucide/astro/icons/plug';
import Rocket from '@lucide/astro/icons/rocket';
import Route from '@lucide/astro/icons/route';
import ScrollText from '@lucide/astro/icons/scroll-text';
import Search from '@lucide/astro/icons/search';
import Server from '@lucide/astro/icons/server';
import ServerCog from '@lucide/astro/icons/server-cog';
import Settings from '@lucide/astro/icons/settings';
import ShieldAlert from '@lucide/astro/icons/shield-alert';
import ShieldCheck from '@lucide/astro/icons/shield-check';
import Target from '@lucide/astro/icons/target';
import Unplug from '@lucide/astro/icons/unplug';
import UserCheck from '@lucide/astro/icons/user-check';
import UserCog from '@lucide/astro/icons/user-cog';
import Users from '@lucide/astro/icons/users';
import Workflow from '@lucide/astro/icons/workflow';
import X from '@lucide/astro/icons/x';

export const icons = {
  activity: Activity,
  'arrow-left-right': ArrowLeftRight,
  'arrow-up': ArrowUp,
  'badge-check': BadgeCheck,
  blocks: Blocks,
  'book-open': BookOpen,
  briefcase: Briefcase,
  building: Building,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'circle-check': CircleCheck,
  'clipboard-check': ClipboardCheck,
  cloud: Cloud,
  compass: Compass,
  database: Database,
  eye: Eye,
  'file-check': FileCheck,
  fingerprint: Fingerprint,
  'flask-conical': FlaskConical,
  'git-merge': GitMerge,
  'globe-lock': GlobeLock,
  'graduation-cap': GraduationCap,
  handshake: Handshake,
  'key-round': KeyRound,
  landmark: Landmark,
  layers: Layers,
  'life-buoy': LifeBuoy,
  lightbulb: Lightbulb,
  lock: Lock,
  'log-in': LogIn,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  microscope: Microscope,
  'monitor-cog': MonitorCog,
  mouse: Mouse,
  network: Network,
  phone: Phone,
  plug: Plug,
  rocket: Rocket,
  route: Route,
  'scroll-text': ScrollText,
  search: Search,
  server: Server,
  'server-cog': ServerCog,
  settings: Settings,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  target: Target,
  unplug: Unplug,
  'user-check': UserCheck,
  'user-cog': UserCog,
  users: Users,
  workflow: Workflow,
  x: X,
} as const;

export type IconName = keyof typeof icons;
