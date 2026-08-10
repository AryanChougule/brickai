import type { CapabilityDetail } from "@/lib/types";
import { aiCapabilityDetails } from "./ai";
import { industrialCapabilityDetails } from "./industrial";
import { productCapabilityDetails } from "./product";

/**
 * Deep-dive content keyed by capability slug, split across three files so no
 * single module grows unreadable. Every slug in `capabilities` must be present
 * here — `lib/cms` asserts that at access time.
 */
export const capabilityDetails: Record<string, CapabilityDetail> = {
  ...aiCapabilityDetails,
  ...industrialCapabilityDetails,
  ...productCapabilityDetails,
};
