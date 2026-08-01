"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "./ui/Button";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const dashboardHref =
    user?.role === "TENANT" ? "/dashboard/tenant" : user?.role === "LANDLORD" ? "/dashboard/landlord" : "/dashboard/admin";

  return (
    <header className="sticky top-0 z-20 border-b border-stone/20 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-forest">
          <Home className="h-5 w-5" />
          RentNest
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/properties" className="text-sm text-ink hover:text-forest">
            Browse
          </Link>

          {user ? (
            <>
              <Link href={dashboardHref} className="text-sm text-ink hover:text-forest">
                Dashboard
              </Link>
              <span className="hidden text-sm text-stone sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <Button variant="ghost" onClick={handleLogout} className="!px-3">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-ink hover:text-forest">
                Log in
              </Link>
              <Link href="/auth/register">
                <Button className="!px-4 !py-2 text-xs">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
