import { Loader2, Inbox } from "lucide-react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-card border border-stone/20 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-forest/10 text-forest",
  UNAVAILABLE: "bg-stone/15 text-stone",
  RENTED: "bg-gold/15 text-gold",
  PENDING: "bg-gold/15 text-gold",
  APPROVED: "bg-sky/10 text-sky",
  REJECTED: "bg-rust/10 text-rust",
  ACTIVE: "bg-forest/10 text-forest",
  COMPLETED: "bg-stone/15 text-stone",
  FAILED: "bg-rust/10 text-rust",
  BANNED: "bg-rust/10 text-rust",
};

export function Badge({ status, children }: { status: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status] || "bg-stone/15 text-stone"
      }`}
    >
      {children}
    </span>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-card border border-stone/20 bg-white">
      <div className="h-44 w-full bg-stone/10" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-stone/10" />
        <div className="h-3 w-1/2 rounded bg-stone/10" />
        <div className="h-3 w-1/3 rounded bg-stone/10" />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-forest" />
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-stone/30 py-16 text-center">
      <Inbox className="h-8 w-8 text-stone/60" />
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-stone">{description}</p>}
    </div>
  );
}
