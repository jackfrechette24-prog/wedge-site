import { Blinds, PhoneCall, Sun, Target, TrendingUp, type LucideIcon } from "lucide-react";
import type { IconName } from "@/content/types";

export const ICONS: Record<IconName, LucideIcon> = {
  target: Target,
  "phone-call": PhoneCall,
  "trending-up": TrendingUp,
  blinds: Blinds,
  sun: Sun,
};
