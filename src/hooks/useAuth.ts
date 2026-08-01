import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { ApiSuccess, User } from "@/lib/types";
import type { LoginInput, RegisterInput } from "@/lib/validations";

interface AuthResponse {
  user: User;
  token: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const res = await api.post<ApiSuccess<AuthResponse>>("/auth/login", input);
      return res.data.data;
    },
    onSuccess: (data) => setAuth(data.user, data.token),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const res = await api.post<ApiSuccess<AuthResponse>>("/auth/register", input);
      return res.data.data;
    },
    onSuccess: (data) => setAuth(data.user, data.token),
  });
}
