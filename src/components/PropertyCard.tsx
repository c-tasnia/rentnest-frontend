import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import { Card, Badge } from "./ui/Primitives";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0];

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-44 w-full bg-stone/10">
          {image ? (
            <Image src={image} alt={property.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-stone/50">
              <MapPin className="h-8 w-8" />
            </div>
          )}
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 font-display text-sm font-semibold text-forest shadow-sm">
            ৳{Number(property.price).toLocaleString()}/mo
          </div>
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg leading-snug text-ink group-hover:text-forest">
              {property.title}
            </h3>
            <Badge status={property.status}>{property.status}</Badge>
          </div>
          <p className="flex items-center gap-1 text-sm text-stone">
            <MapPin className="h-3.5 w-3.5" />
            {property.city}
          </p>
          <div className="flex gap-4 pt-1 text-sm text-stone">
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.bathrooms}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
