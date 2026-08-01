import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccess, Category, Property } from "@/lib/types";
import type { PropertyInput } from "@/lib/validations";

export interface PropertyFilters {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  bedrooms?: string;
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Property[]>>("/properties", { params: filters });
      return res.data;
    },
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Property>>(`/properties/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Category[]>>("/categories");
      return res.data.data;
    },
  });
}

export function useMyProperties() {
  return useQuery({
    queryKey: ["landlord-properties"],
    queryFn: async () => {
      const res = await api.get<ApiSuccess<Property[]>>("/landlord/properties");
      return res.data.data;
    },
  });
}

function toPropertyPayload(input: PropertyInput) {
  return {
    ...input,
    price: Number(input.price),
    bedrooms: Number(input.bedrooms),
    bathrooms: Number(input.bathrooms),
    amenities: input.amenities
      ? input.amenities.split(",").map((a) => a.trim()).filter(Boolean)
      : [],
    images: input.images
      ? input.images.split(",").map((u) => u.trim()).filter(Boolean)
      : [],
  };
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PropertyInput) => {
      const res = await api.post<ApiSuccess<Property>>("/landlord/properties", toPropertyPayload(input));
      return res.data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landlord-properties"] }),
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<PropertyInput> & { status?: string }) => {
      const res = await api.put<ApiSuccess<Property>>(`/landlord/properties/${id}`, input);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["landlord-properties"] });
      qc.invalidateQueries({ queryKey: ["property", id] });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/landlord/properties/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landlord-properties"] }),
  });
}
