import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccess, Property, RentalRequest, User } from "@/lib/types";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<User[]>>("/admin/users");
      return res.data.data;
    },
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "ACTIVE" | "BANNED" }) => {
      const res = await api.patch<ApiSuccess<User>>(`/admin/users/${id}`, { status });
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useAdminProperties() {
  return useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Property[]>>("/admin/properties");
      return res.data.data;
    },
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<RentalRequest[]>>("/admin/rentals");
      return res.data.data;
    },
  });
}
