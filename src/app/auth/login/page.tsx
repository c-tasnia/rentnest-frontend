"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { loginSchema, LoginInput } from "@/lib/validations";
import { useLogin } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { Input, Field } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Primitives";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginInput) {
    login.mutate(values, {
      onSuccess: (data) => {
        toast.success(`Welcome back, ${data.user.name.split(" ")[0]}`);
        const redirect = searchParams.get("redirect");
        if (redirect) return router.push(redirect);
        const dashboard =
          data.user.role === "TENANT"
            ? "/dashboard/tenant"
            : data.user.role === "LANDLORD"
            ? "/dashboard/landlord"
            : "/dashboard/admin";
        router.push(dashboard);
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-6 font-display text-3xl text-ink">Log in</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="you@example.com" {...register("email")} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" placeholder="••••••••" {...register("password")} />
          </Field>
          <Button type="submit" className="w-full" loading={login.isPending}>
            Log in
          </Button>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-stone">
        No account?{" "}
        <Link href="/auth/register" className="font-medium text-forest hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
