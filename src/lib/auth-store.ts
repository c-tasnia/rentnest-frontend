import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        Cookies.set("token", token, { expires: 7, sameSite: "lax" });
        Cookies.set("role", user.role, { expires: 7, sameSite: "lax" });
        set({ user, token });
      },
      logout: () => {
        Cookies.remove("token");
        Cookies.remove("role");
        set({ user: null, token: null });
      },
    }),
    {
      name: "rentnest-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
