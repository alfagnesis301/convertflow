/**
 * Explicit icon map — avoids `import * as LucideIcons` (which pulls in 4 MB+).
 * Only import the icons actually used in toolsConfig.ts and category pages.
 */
import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Table2,
  Image,
  Pen,
  Images,
  FileSearch,
  FileType,
  Code,
  Hash,
  GitMerge,
  Scissors,
  PackageOpen,
  RotateCw,
  Lock,
  Unlock,
  ArrowUpDown,
  FileMinus,
  ScanText,
  ArrowLeftRight,
  Wrench,
  Briefcase,
  Sheet,
  ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Table: Table2,
  Table2,
  Presentation: FileText, // fallback
  Image,
  Pen,
  Images,
  FileSearch,
  FileType,
  Code,
  Hash,
  Sheet,
  GitMerge,
  Scissors,
  PackageOpen,
  RotateCw,
  Lock,
  Unlock,
  ArrowUpDown,
  FileMinus,
  ScanText,
  ArrowLeftRight,
  Wrench,
  Briefcase,
  ArrowRight,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? FileText;
}
