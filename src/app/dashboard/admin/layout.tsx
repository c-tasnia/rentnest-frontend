import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <nav className="flex gap-4 border-b border-stone/20 pb-3 text-sm">
        <Link href="/dashboard/admin" className="text-ink hover:text-forest">
          Overview
        </Link>
        <Link href="/dashboard/admin/users" className="text-ink hover:text-forest">
          Users
        </Link>
        <Link href="/dashboard/admin/properties" className="text-ink hover:text-forest">
          Properties
        </Link>
        <Link href="/dashboard/admin/rentals" className="text-ink hover:text-forest">
          Rentals
        </Link>
      </nav>
      {children}
    </div>
  );
}
