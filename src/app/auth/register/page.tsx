"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { useRegister } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { Input, Select, Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Primitives";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  function onSubmit(values: RegisterInput) {
    registerMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success("Account created");
        router.push(data.user.role === "TENANT" ? "/dashboard/tenant" : "/dashboard/landlord");
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-6 font-display text-3xl text-ink">Create an account</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Full name" error={errors.name?.message}>
            <Input placeholder="Jane Doe" {...register("name")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@example.com" {...register("email")} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" placeholder="At least 6 characters" {...register("password")} />
          </Field>
          <Field label="Phone (optional)" error={errors.phone?.message}>
            <Input placeholder="+880..." {...register("phone")} />
          </Field>
          <Field label="I am a..." error={errors.role?.message}>
            <Select {...register("role")} defaultValue="">
              <option value="" disabled>
                Choose a role
              </option>
              <option value="TENANT">Tenant — looking for a place</option>
              <option value="LANDLORD">Landlord — listing a property</option>
            </Select>
          </Field>
          <Button type="submit" className="w-full" loading={registerMutation.isPending}>
            Sign up
          </Button>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-stone">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-forest hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
