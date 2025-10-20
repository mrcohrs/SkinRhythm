import type { User } from "./schema";

export type MembershipTier = "free" | "premium" | "premium_plus";

export interface UserEntitlements {
  // Core membership
  tier: MembershipTier;
  isPremium: boolean;
  isFoundingMember: boolean;
  
  // Feature access
  hasUnlimitedScans: boolean;
  hasRoutineCoach: boolean;
  hasProductAlternatives: boolean;
  hasRoutineLibrary: boolean;
  
  // Scan tracking
  scansRemaining: number | "unlimited";
  canScan: boolean;
}

const FREE_TIER_SCANS = 3;

/**
 * Calculate user entitlements based on membership tier and purchases
 * This is the single source of truth for feature access
 */
export function getUserEntitlements(
  user: User | null | undefined,
  purchases?: Array<{ productType: string; expiresAt: Date | null }>
): UserEntitlements {
  // Default entitlements for unauthenticated users
  if (!user) {
    return {
      tier: "free",
      isPremium: false,
      isFoundingMember: false,
      hasUnlimitedScans: false,
      hasRoutineCoach: false,
      hasProductAlternatives: false,
      hasRoutineLibrary: false,
      scansRemaining: 0,
      canScan: false,
    };
  }

  const tier = (user.membershipTier || "free") as MembershipTier;
  const scanCount = user.scanCount || 0;
  
  // Check if membership is active (not expired)
  const membershipActive = !user.membershipExpiresAt || new Date(user.membershipExpiresAt) > new Date();
  const isPremium = (tier === "premium" || tier === "premium_plus") && membershipActive;
  
  // Check for active unlimited scanner addon purchase
  const hasUnlimitedAddon = purchases?.some(
    (p) =>
      p.productType === "unlimited_scanner" &&
      (!p.expiresAt || new Date(p.expiresAt) > new Date())
  ) || false;

  // Calculate scan access
  const hasUnlimitedScans = isPremium || hasUnlimitedAddon;
  const scansRemaining = hasUnlimitedScans
    ? ("unlimited" as const)
    : Math.max(0, FREE_TIER_SCANS - scanCount);
  const canScan = hasUnlimitedScans || (typeof scansRemaining === "number" && scansRemaining > 0);

  return {
    tier,
    isPremium,
    isFoundingMember: user.isFoundingMember || false,
    
    // Premium features
    hasUnlimitedScans,
    hasRoutineCoach: isPremium,
    hasProductAlternatives: isPremium,
    hasRoutineLibrary: isPremium,
    
    // Scan tracking
    scansRemaining,
    canScan,
  };
}

/**
 * Format scan count for display
 */
export function formatScanCount(scansRemaining: number | "unlimited"): string {
  if (scansRemaining === "unlimited") {
    return "Unlimited scans";
  }
  
  if (typeof scansRemaining === "number" && scansRemaining === 0) {
    return "No scans remaining";
  }
  
  return `${scansRemaining} scan${scansRemaining === 1 ? "" : "s"} remaining`;
}
