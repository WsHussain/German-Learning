import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Map,
  Clapperboard,
  BookOpen,
  Mic,
  LineChart,
  CalendarDays,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Shown in the mobile bottom bar (max 5 items). */
  mobile?: boolean;
  mobileLabel?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, mobile: true, mobileLabel: "Home" },
  { label: "Roadmap", href: "/roadmap", icon: Map, mobile: true, mobileLabel: "Learn" },
  { label: "Videos", href: "/videos", icon: Clapperboard, mobile: true, mobileLabel: "Videos" },
  { label: "Vocabulary", href: "/vocabulary", icon: BookOpen, mobile: true, mobileLabel: "Words" },
  { label: "Speaking", href: "/speaking", icon: Mic },
  { label: "Progress", href: "/progress", icon: LineChart, mobile: true, mobileLabel: "Progress" },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.mobile);
