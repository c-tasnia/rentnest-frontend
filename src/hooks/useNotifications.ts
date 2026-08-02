"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useMyRentalRequests } from "./useRentals";
import { useLandlordRequests } from "./useRentals";
import { useAdminRentals } from "./useAdmin";
import type { RentalRequest } from "@/lib/types";

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
}

function seenKey(userId: string) {
  return `rentnest-notifications-seen:${userId}`;
}

function buildTenantItems(requests: RentalRequest[]): NotificationItem[] {
  return requests
    .filter((r) => r.status === "APPROVED" || r.status === "REJECTED" || r.status === "ACTIVE")
    .map((r) => ({
      id: r.id,
      message:
        r.status === "APPROVED"
          ? `Your request for "${r.property?.title}" was approved`
          : r.status === "REJECTED"
          ? `Your request for "${r.property?.title}" was rejected`
          : `Your rental for "${r.property?.title}" is now active`,
      timestamp: r.updatedAt || r.createdAt,
    }));
}

function buildLandlordItems(requests: RentalRequest[]): NotificationItem[] {
  return requests
    .filter((r) => r.status === "PENDING")
    .map((r) => ({
      id: r.id,
      message: `New rental request for "${r.property?.title}" from ${r.tenant?.name}`,
      timestamp: r.createdAt,
    }));
}

function buildAdminItems(requests: RentalRequest[]): NotificationItem[] {
  return requests.slice(0, 10).map((r) => ({
    id: r.id,
    message: `${r.tenant?.name} requested "${r.property?.title}" — ${r.status.toLowerCase()}`,
    timestamp: r.updatedAt || r.createdAt,
  }));
}

export function useNotifications() {
  const { user } = useAuthStore();
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  const tenantQuery = useMyRentalRequests();
  const landlordQuery = useLandlordRequests();
  const adminQuery = useAdminRentals();

  const enabledQuery =
    user?.role === "TENANT" ? tenantQuery : user?.role === "LANDLORD" ? landlordQuery : adminQuery;

  useEffect(() => {
    if (!user) return;
    setLastSeen(localStorage.getItem(seenKey(user.id)));
  }, [user]);

  let items: NotificationItem[] = [];
  if (user?.role === "TENANT" && tenantQuery.data) {
    items = buildTenantItems(tenantQuery.data);
  } else if (user?.role === "LANDLORD" && landlordQuery.data) {
    items = buildLandlordItems(landlordQuery.data);
  } else if (user?.role === "ADMIN" && adminQuery.data) {
    items = buildAdminItems(adminQuery.data);
  }

  items = items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15);

  const unreadCount = lastSeen
    ? items.filter((i) => new Date(i.timestamp).getTime() > new Date(lastSeen).getTime()).length
    : items.length;

  function markAllSeen() {
    if (!user) return;
    const now = new Date().toISOString();
    localStorage.setItem(seenKey(user.id), now);
    setLastSeen(now);
  }

  return { items, unreadCount, markAllSeen, isLoading: enabledQuery.isLoading };
}