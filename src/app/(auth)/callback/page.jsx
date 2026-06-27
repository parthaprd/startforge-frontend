"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService, saveToken } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { getDashboardRoute } from "@/constants/routes";
import Spinner from "@/components/ui/Spinner";

/**
 * OAuth callback page.
 *
 * After Google OAuth, the backend redirects here with ?token=<jwt>
 * We save the token, fetch the user profile, set auth context, then
 * redirect to the appropriate dashboard.
 */
export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error || !token) {
        router.replace("/login?error=google_failed");
        return;
      }

      // Save token then fetch the user profile
      saveToken(token);

      try {
        const response = await authService.getMe();
        if (response?.success && response?.data) {
          setUser(response.data);
          router.replace(getDashboardRoute(response.data.role || "collaborator"));
        } else {
          router.replace("/login?error=oauth_failed");
        }
      } catch {
        router.replace("/login?error=oauth_failed");
      }
    };

    handleCallback();
  }, [router, setUser, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-mute">Signing you in...</p>
    </div>
  );
}
