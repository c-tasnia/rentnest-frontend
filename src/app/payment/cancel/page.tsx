"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Primitives";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tranId");

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <Card className="p-8">
        <XCircle className="mx-auto h-14 w-14 text-rust" />
        <h1 className="mt-4 font-display text-2xl text-ink">Payment cancelled</h1>
        <p className="mt-2 text-sm text-stone">
          The payment didn't go through, or was cancelled. You can try again from your dashboard.
        </p>
        {tranId && (
          <p className="mt-2 text-xs text-stone">
            Transaction ID: <span className="font-mono">{tranId}</span>
          </p>
        )}
        <Link href="/dashboard/tenant">
          <Button className="mt-6">Back to my rentals</Button>
        </Link>
      </Card>
    </div>
  );
}
