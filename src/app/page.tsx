"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/Button";
import { PropertyGridSkeleton, EmptyState } from "@/components/ui/Primitives";

export default function HomePage() {
  const { data, isLoading } = useProperties({});
  const featured = data?.data.slice(0, 6) ?? [];

  return (
    <div className="space-y-10">
      <section className="rounded-card bg-forest px-8 py-14 text-cream">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-gold-light">Find & list rentals with ease</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          A calmer way to find your next home.
        </h1>
        <p className="mt-3 max-w-lg text-cream/80">
          Browse verified listings from real landlords, submit a request, and pay securely — all in one place.
        </p>
        <Link href="/properties">
          <Button variant="secondary" className="mt-6">
            Browse all properties <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Featured properties</h2>
          <Link href="/properties" className="text-sm font-medium text-forest hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <PropertyGridSkeleton count={3} />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState title="No properties listed yet" description="Check back soon for new listings." />
        )}
      </section>
    </div>
  );
}
