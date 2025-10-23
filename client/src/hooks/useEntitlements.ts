import { useQuery } from "@tanstack/react-query";

export interface Entitlements {
  isPremium: boolean;
  hasPremiumRoutineAccess: boolean;
  hasDetailedPdfAccess: boolean;
  hasUnlimitedScans: boolean;
  scanCount: number;
  membershipTier: string | null;
  isFoundingMember: boolean;
  unlimitedScannerExpiresAt: Date | null;
  membershipExpiresAt: Date | null;
  premiumRoutineAccessRoutineId: string | null;
}

export function useEntitlements() {
  const query = useQuery<Entitlements>({
    queryKey: ['/api/user/entitlements'],
    retry: false,
  });

  return {
    ...query,
    // Computed helpers for common checks
    canAccessPremiumRoutines: query.data?.isPremium || query.data?.hasPremiumRoutineAccess || false,
    canAccessProductAlternatives: query.data?.isPremium || query.data?.hasPremiumRoutineAccess || false,
    canAccessRoutineCoach: query.data?.isPremium || false,
    canAccessDetailedPdf: query.data?.isPremium || query.data?.hasDetailedPdfAccess || false,
    canScanIngredients: (query.data?.hasUnlimitedScans || (query.data?.scanCount ?? 0) > 0) || false,
    remainingScans: query.data?.scanCount ?? 0,
  };
}
