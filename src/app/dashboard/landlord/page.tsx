"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ListChecks } from "lucide-react";
import { useMyProperties, useDeleteProperty } from "@/hooks/useProperties";
import { useLandlordRequests } from "@/hooks/useRentals";
import { getApiErrorMessage } from "@/lib/api";
import { Card, Badge, Spinner, EmptyState } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";

function StatsRow() {
  const { data: properties, isLoading: loadingProps } = useMyProperties();
  const { data: requests, isLoading: loadingReqs } = useLandlordRequests();

  if (loadingProps || loadingReqs) return <Spinner />;

  const activeRequests = requests?.filter((r) => r.status === "APPROVED" || r.status === "ACTIVE").length ?? 0;
  const earnings = requests?.reduce((sum, r) => {
    if (r.payment?.status === "COMPLETED") return sum + Number(r.payment.amount);
    return sum;
  }, 0) ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-5">
        <p className="text-sm text-stone">Total properties</p>
        <p className="mt-1 font-display text-2xl text-forest">{properties?.length ?? 0}</p>
      </Card>
      <Card className="p-5">
        <p className="text-sm text-stone">Active requests</p>
        <p className="mt-1 font-display text-2xl text-forest">{activeRequests}</p>
      </Card>
      <Card className="p-5">
        <p className="text-sm text-stone">Earnings</p>
        <p className="mt-1 font-display text-2xl text-forest">৳{earnings.toLocaleString()}</p>
      </Card>
    </div>
  );
}

export default function LandlordDashboardPage() {
  const { data: properties, isLoading } = useMyProperties();
  const deleteProperty = useDeleteProperty();

  function handleDelete(id: string) {
    if (!confirm("Delete this property listing? This can't be undone.")) return;
    deleteProperty.mutate(id, {
      onSuccess: () => toast.success("Property deleted"),
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Landlord overview</h1>
        <div className="flex gap-3">
          <Link href="/dashboard/landlord/requests">
            <Button variant="secondary">
              <ListChecks className="h-4 w-4" /> Rental requests
            </Button>
          </Link>
          <Link href="/dashboard/landlord/properties/new">
            <Button>
              <Plus className="h-4 w-4" /> Add property
            </Button>
          </Link>
        </div>
      </div>

      <StatsRow />

      <div className="space-y-4">
        <h2 className="font-display text-2xl text-ink">My properties</h2>
        {isLoading ? (
          <Spinner />
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {properties.map((p) => (
              <Card key={p.id} className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg text-ink">{p.title}</h3>
                  <Badge status={p.status}>{p.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-stone">{p.city}</p>
                <p className="mt-1 font-display text-lg text-forest">৳{Number(p.price).toLocaleString()}/mo</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/landlord/properties/${p.id}/edit`}>
                    <Button variant="secondary" className="!px-3 !py-2 text-xs">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="!px-3 !py-2 text-xs"
                    onClick={() => handleDelete(p.id)}
                    loading={deleteProperty.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No properties yet" description="Add your first listing to start receiving rental requests." />
        )}
      </div>
    </div>
  );
}
