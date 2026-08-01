import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="font-display text-3xl text-ink">Page not found</h2>
      <p className="text-sm text-stone">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/">
        <Button>Back to listings</Button>
      </Link>
    </div>
  );
}
