"use client";

import { useAdminUsers, useAdminProperties, useAdminRentals } from "@/hooks/useAdmin";
import { Card, Spinner } from "@/components/ui/Primitives";

export default function AdminDashboardPage() {
  const { data: users, isLoading: loadingUsers } = useAdminUsers();
  const { data: properties, isLoading: loadingProperties } = useAdminProperties();
  const { data: rentals, isLoading: loadingRentals } = useAdminRentals();

  const isLoading = loadingUsers || loadingProperties || loadingRentals;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Admin overview</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <p className="text-sm text-stone">Total users</p>
            <p className="mt-1 font-display text-3xl text-forest">{users?.length ?? 0}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-stone">Total properties</p>
            <p className="mt-1 font-display text-3xl text-forest">{properties?.length ?? 0}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-stone">Total rental requests</p>
            <p className="mt-1 font-display text-3xl text-forest">{rentals?.length ?? 0}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
