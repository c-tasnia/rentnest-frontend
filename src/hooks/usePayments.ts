import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccess, Payment } from "@/lib/types";
import type { ReviewInput } from "@/lib/validations";

export function useMyPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Payment[]>>("/payments");
      return res.data.data;
    },
  });
}

export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: async (rentalRequestId: string) => {
      const res = await api.post<ApiSuccess<{ payment: Payment; gatewayUrl: string }>>(
        "/payments/create",
        { rentalRequestId }
      );
      return res.data.data;
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ReviewInput & { rentalRequestId: string }) => {
      const res = await api.post("/reviews", input);
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-rentals"] }),
  });
}
