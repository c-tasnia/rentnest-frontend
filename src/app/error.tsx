"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="font-display text-2xl text-ink">Something went wrong</h2>
      <p className="max-w-md text-sm text-stone">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
