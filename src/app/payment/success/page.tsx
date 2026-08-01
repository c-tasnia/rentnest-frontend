"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Primitives";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tranId");

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <Card className="p-8">
        <CheckCircle2 className="mx-auto h-14 w-14 text-forest" />
        <h1 className="mt-4 font-display text-2xl text-ink">Payment successful</h1>
        <p className="mt-2 text-sm text-stone">Your rental is now active — the landlord has been notified.</p>
        {tranId && (
          <p className="mt-2 text-xs text-stone">
            Transaction ID: <span className="font-mono">{tranId}</span>
          </p>
        )}
        <Link href="/dashboard/tenant">
          <Button className="mt-6">Go to my rentals</Button>
        </Link>
      </Card>
    </div>
  );
}
