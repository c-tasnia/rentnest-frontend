"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { items, unreadCount, markAllSeen, isLoading } = useNotifications();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle() {
    setOpen((o) => {
      const next = !o;
      if (next) markAllSeen();
      return next;
    });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative rounded-full p-2 text-ink hover:bg-stone/10"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rust text-[10px] font-semibold text-cream">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-card border border-stone/20 bg-white p-3 shadow-lg">
          <p className="mb-2 px-1 font-display text-sm font-semibold text-ink">Notifications</p>
          {isLoading ? (
            <p className="px-1 py-4 text-center text-sm text-stone">Loading...</p>
          ) : items.length === 0 ? (
            <p className="px-1 py-4 text-center text-sm text-stone">Nothing new yet.</p>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="rounded-lg px-2 py-2 text-sm hover:bg-stone/5">
                  <p className="text-ink">{item.message}</p>
                  <p className="mt-0.5 text-xs text-stone">{timeAgo(item.timestamp)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}