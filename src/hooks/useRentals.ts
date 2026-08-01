import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccess, RentalRequest, RentalStatus } from "@/lib/types";
import type { RentalRequestInput } from "@/lib/validations";

export function useMyRentalRequests() {
  return useQuery({
    queryKey: ["my-rentals"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<RentalRequest[]>>("/rentals");
      return res.data.data;
    },
  });
}

export function useLandlordRequests() {
  return useQuery({
    queryKey: ["landlord-requests"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<RentalRequest[]>>("/landlord/requests");
      return res.data.data;
    },
  });
}

export function useCreateRentalRequest(propertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RentalRequestInput) => {
      const res = await api.post<ApiSuccess<RentalRequest>>("/rentals", {
        propertyId,
        ...input,
      });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-rentals"] }),
  });
}

export function useUpdateRentalStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Extract<RentalStatus, "APPROVED" | "REJECTED"> }) => {
      const res = await api.patch<ApiSuccess<RentalRequest>>(`/landlord/requests/${id}`, { status });
      return res.data.data;
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["landlord-requests"] });
      const previous = qc.getQueryData<RentalRequest[]>(["landlord-requests"]);
      qc.setQueryData<RentalRequest[]>(["landlord-requests"], (old) =>
        old?.map((r) => (r.id === id ? { ...r, status } : r))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(["landlord-requests"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["landlord-requests"] }),
  });
}
