import {
  Boxes,
  Briefcase,
  GraduationCap,
  Users,
  Database,
  Download,
  FileText,
  GitBranch,
  Network,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

/** Icon shown next to a project name in list views. Falls back to Boxes. */
const icons: Record<string, LucideIcon> = {
  huell: FileText,
  vortexdb: Search,
  watchdog: ShieldCheck,
  pgmoneta: Database,
  'wasmedge-installer': Download,
  meridb: Database,
  zynk: Network,
  indexium: GitBranch,
  greptimedb: Database,
  'ask-racha': Search,
  pgagroal: Database,
  'pgexporter-ext': Database,
  pgexporter: Database,
};

export const projectIcon = (id: string): LucideIcon => icons[id] ?? Boxes;

/** Icon shown next to a role. Falls back to Briefcase. */
const roleIcons: Record<string, LucideIcon> = {
  'lfx-wasmedge': GraduationCap,
  'pldg-cohort-4': Users,
  'pldg-cohort-3': Users,
  'sds-labs-dev': Users,
};

export const experienceIcon = (id: string): LucideIcon =>
  roleIcons[id] ?? Briefcase;
