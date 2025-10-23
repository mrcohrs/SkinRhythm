import { useQuery } from "@tanstack/react-query";

export interface FoundingRateStatus {
  active: boolean;
  purchasesRemaining: number;
}

export function useFoundingRate() {
  return useQuery<FoundingRateStatus>({
    queryKey: ['/api/payments/founding-rate-status'],
    refetchInterval: 60000, // Refetch every minute
  });
}
