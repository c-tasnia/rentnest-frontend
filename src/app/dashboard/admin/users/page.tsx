"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Ban, ShieldCheck, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/useAdmin";
import { getApiErrorMessage } from "@/lib/api";
import { Card, Badge, Spinner, EmptyState } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PAGE_SIZE = 8;

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleStatus(id: string, current: string) {
    const next = current === "BANNED" ? "ACTIVE" : "BANNED";
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => toast.success(`User ${next === "BANNED" ? "banned" : "unbanned"}`),
        onError: (err) => toast.error(getApiErrorMessage(err)),
      }
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Users</h1>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
          <Input
            placeholder="Search by name, email, role..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : filtered.length > 0 ? (
        <>
          <div className="space-y-3">
            {paginated.map((u) => (
              <Card key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-ink">
                    {u.name} <span className="text-xs text-stone">({u.role})</span>
                  </p>
                  <p className="text-sm text-stone">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={u.status}>{u.status}</Badge>
                  {u.role !== "ADMIN" && (
                    <Button
                      variant={u.status === "BANNED" ? "secondary" : "danger"}
                      className="!px-3 !py-2 text-xs"
                      onClick={() => toggleStatus(u.id, u.status)}
                      loading={updateStatus.isPending}
                    >
                      {u.status === "BANNED" ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" /> Unban
                        </>
                      ) : (
                        <>
                          <Ban className="h-3.5 w-3.5" /> Ban
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant="secondary"
                className="!px-3 !py-2"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-stone">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                className="!px-3 !py-2"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No users found" description="Try a different search term." />
      )}
    </div>
  );
}
