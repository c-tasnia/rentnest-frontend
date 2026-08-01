"use client";

import { useAdminRentals } from "@/hooks/useAdmin";
import { Card, Badge, Spinner, EmptyState } from "@/components/ui/Primitives";

export default function AdminRentalsPage() {
  const { data: rentals, isLoading } = useAdminRentals();

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-ink">All rental requests</h1>
      {isLoading ? (
        <Spinner />
      ) : rentals && rentals.length > 0 ? (
        <div className="space-y-3">
          {rentals.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-ink">{r.property?.title}</p>
                <p className="text-sm text-stone">
                  Tenant: {r.tenant?.name} ({r.tenant?.email})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={r.status}>{r.status}</Badge>
                {r.payment && <Badge status={r.payment.status}>{r.payment.status}</Badge>}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No rental requests found" />
      )}
    </div>
  );
}
