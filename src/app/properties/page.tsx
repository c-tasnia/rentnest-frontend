"use client";

import { useState } from "react";
import { useProperties, useCategories, PropertyFilters } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";
import { Input, Select } from "@/components/ui/Input";
import { PropertyGridSkeleton, EmptyState } from "@/components/ui/Primitives";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { data, isLoading } = useProperties(filters);
  const { data: categories } = useCategories();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ink">Browse properties</h1>

      <section className="flex flex-wrap gap-3 rounded-card border border-stone/20 bg-white p-4">
        <Input
          placeholder="City"
          className="max-w-[160px]"
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value || undefined }))}
        />
        <Input
          placeholder="Min price"
          type="number"
          className="max-w-[130px]"
          onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value || undefined }))}
        />
        <Input
          placeholder="Max price"
          type="number"
          className="max-w-[130px]"
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value || undefined }))}
        />
        <Input
          placeholder="Min bedrooms"
          type="number"
          className="max-w-[140px]"
          onChange={(e) => setFilters((f) => ({ ...f, bedrooms: e.target.value || undefined }))}
        />
        <Select
          className="max-w-[180px]"
          onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value || undefined }))}
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </section>

      {isLoading ? (
        <PropertyGridSkeleton />
      ) : data && data.data.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>
      ) : (
        <EmptyState title="No properties match your filters" description="Try widening your search or check back soon." />
      )}
    </div>
  );
}
