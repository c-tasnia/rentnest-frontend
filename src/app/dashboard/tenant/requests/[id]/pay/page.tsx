"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreatePaymentSession } from "@/hooks/usePayments";
import { getApiErrorMessage } from "@/lib/api";
import { Spinner } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";

export default function InitiatePaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const createPayment = useCreatePaymentSession();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;

    createPayment.mutate(id, {
      onSuccess: (data) => {
        window.location.href = data.gatewayUrl;
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err));
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      {createPayment.isError ? (
        <>
          <p className="mb-4 text-ink">We couldn't start the payment.</p>
          <Button onClick={() => router.push("/dashboard/tenant")}>Back to dashboard</Button>
        </>
      ) : (
        <>
          <Spinner />
          <p className="text-sm text-stone">Redirecting you to secure checkout…</p>
        </>
      )}
    </div>
  );
}
