"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService, saveToken } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { getDashboardRoute } from "@/constants/routes";
import Spinner from "@/components/ui/Spinner";

/**
 * OAuth callback landing page.
 *
 * After Google OAuth completes, Better Auth redirects the browser here.
 * The session cookie is set on the backend domain — which is cross-origin
 * and may be blocked by the browser. Instead, we call getSession which
 * sends our stored token as a Cookie header, get the user, and proceed.
 *
 * For Google OAuth specifically, Better Auth may pass the token as a
 * query param (token=...) — we capture that first if present.
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
      try {
        // Better Auth sometimes returns the token as a URL param after OAuth
        const urlToken = searchParams.get('token');
        if (urlToken) {
          saveToken(urlToken);
        }

        const response = await authService.getSession();

        if (response && response.user) {
          setUser(response.user);
          router.replace(getDashboardRoute(response.user.role || "collaborator"));
        } else {
          router.replace("/login?error=oauth_failed");
        }
      } catch (err) {
        console.error("[OAuth Callback] Session fetch failed:", err);
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
