"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { useMyRentalRequests } from "@/hooks/useRentals";
import { useMyPayments, useCreateReview } from "@/hooks/usePayments";
import { getApiErrorMessage } from "@/lib/api";
import { reviewSchema, ReviewInput } from "@/lib/validations";
import { Card, Badge, Spinner, EmptyState } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Field } from "@/components/ui/Input";
import type { RentalRequest } from "@/lib/types";

function ReviewForm({ rentalRequestId }: { rentalRequestId: string }) {
  const [open, setOpen] = useState(false);
  const createReview = useCreateReview();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 5 } });

  function onSubmit(values: ReviewInput) {
    createReview.mutate(
      { ...values, rentalRequestId },
      {
        onSuccess: () => {
          toast.success("Review submitted");
          setOpen(false);
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      }
    );
  }

  if (!open) {
    return (
      <Button variant="secondary" className="mt-2" onClick={() => setOpen(true)}>
        Leave a review
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3 rounded-lg bg-stone/5 p-4">
      <Field label="Rating (1-5)" error={errors.rating?.message}>
        <Input type="number" min={1} max={5} {...register("rating")} />
      </Field>
      <Field label="Comment" error={errors.comment?.message}>
        <Textarea placeholder="How was your stay?" {...register("comment")} />
      </Field>
      <Button type="submit" loading={createReview.isPending}>
        Submit review
      </Button>
    </form>
  );
}

function RequestRow({ request }: { request: RentalRequest }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-ink">{request.property?.title}</h3>
          <p className="flex items-center gap-1 text-sm text-stone">
            <MapPin className="h-3.5 w-3.5" /> {request.property?.city}
          </p>
          <p className="mt-1 text-xs text-stone">
            Move-in: {new Date(request.moveInDate).toLocaleDateString()}
          </p>
        </div>
        <Badge status={request.status}>{request.status}</Badge>
      </div>

      {request.status === "APPROVED" && !request.payment && (
        <Link href={`/dashboard/tenant/requests/${request.id}/pay`}>
          <Button className="mt-3">Pay now</Button>
        </Link>
      )}

      {request.payment && (
        <p className="mt-3 text-sm text-stone">
          Payment: <Badge status={request.payment.status}>{request.payment.status}</Badge>
        </p>
      )}

      {(request.status === "ACTIVE" || request.status === "COMPLETED") && (
        <ReviewForm rentalRequestId={request.id} />
      )}
    </Card>
  );
}

function PaymentHistoryTable() {
  const { data: payments, isLoading } = useMyPayments();

  if (isLoading) return <Spinner />;
  if (!payments || payments.length === 0) {
    return <EmptyState title="No payments yet" description="Payments you make will show up here." />;
  }

  return (
    <div className="overflow-x-auto rounded-card border border-stone/20 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone/20 text-left text-stone">
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Transaction ID</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Paid At</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b border-stone/10 last:border-0">
              <td className="px-4 py-3 text-ink">{p.rentalRequest?.property?.title ?? "—"}</td>
              <td className="px-4 py-3 text-ink">৳{Number(p.amount).toLocaleString()}</td>
              <td className="px-4 py-3 font-mono text-xs text-stone">{p.transactionId}</td>
              <td className="px-4 py-3">
                <Badge status={p.status}>{p.status}</Badge>
              </td>
              <td className="px-4 py-3 text-stone">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TenantDashboardPage() {
  const { data: requests, isLoading } = useMyRentalRequests();

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="font-display text-3xl text-ink">My rental requests</h1>
        {isLoading ? (
          <Spinner />
        ) : requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((r) => (
              <RequestRow key={r.id} request={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No rental requests yet"
            description="Browse listings and submit a request to get started."
          />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">Payment history</h2>
        <PaymentHistoryTable />
      </section>
    </div>
  );
}
