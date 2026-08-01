"use client";

import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { useLandlordRequests, useUpdateRentalStatus } from "@/hooks/useRentals";
import { getApiErrorMessage } from "@/lib/api";
import { Card, Badge, Spinner, EmptyState } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";

export default function LandlordRequestsPage() {
  const { data: requests, isLoading } = useLandlordRequests();
  const updateStatus = useUpdateRentalStatus();

  function handleUpdate(id: string, status: "APPROVED" | "REJECTED") {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Request ${status.toLowerCase()}`),
        onError: (err) => toast.error(getApiErrorMessage(err)),
      }
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Rental requests</h1>
      {isLoading ? (
        <Spinner />
      ) : requests && requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-ink">{r.property?.title}</h3>
                  <p className="text-sm text-stone">
                    From {r.tenant?.name} ({r.tenant?.email})
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    Move-in: {new Date(r.moveInDate).toLocaleDateString()}
                  </p>
                  {r.message && <p className="mt-2 text-sm italic text-ink/70">"{r.message}"</p>}
                </div>
                <Badge status={r.status}>{r.status}</Badge>
              </div>

              {r.status === "PENDING" && (
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => handleUpdate(r.id, "APPROVED")} loading={updateStatus.isPending}>
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button variant="danger" onClick={() => handleUpdate(r.id, "REJECTED")} loading={updateStatus.isPending}>
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No rental requests yet" description="Requests from tenants will appear here." />
      )}
    </div>
  );
}
