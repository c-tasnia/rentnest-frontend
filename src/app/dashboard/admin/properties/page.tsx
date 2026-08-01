"use client";

import { useAdminProperties } from "@/hooks/useAdmin";
import { Card, Badge, Spinner, EmptyState } from "@/components/ui/Primitives";

export default function AdminPropertiesPage() {
  const { data: properties, isLoading } = useAdminProperties();

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-ink">All properties</h1>
      {isLoading ? (
        <Spinner />
      ) : properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {properties.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg text-ink">{p.title}</h3>
                <Badge status={p.status}>{p.status}</Badge>
              </div>
              <p className="text-sm text-stone">{p.city}</p>
              <p className="mt-1 text-xs text-stone">Landlord: {p.landlord?.name}</p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No properties found" />
      )}
    </div>
  );
}
