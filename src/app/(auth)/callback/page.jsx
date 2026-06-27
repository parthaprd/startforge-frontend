"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { getDashboardRoute } from "@/constants/routes";
import Spinner from "@/components/ui/Spinner";

/**
 * OAuth callback landing page.
 *
 * After Google (or any social provider) completes, Better Auth sets the
 * session cookie and redirects the browser here.  We fetch the session,
 * hydrate AuthContext, then forward the user to their dashboard.
 */
export default function CallbackPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const handleCallback = async () => {
      try {
        const response = await authService.getSession();

        if (response && response.user) {
          setUser(response.user);
          router.replace(getDashboardRoute(response.user.role || "collaborator"));
        } else {
          // No session — something went wrong, go back to login
          router.replace("/login?error=oauth_failed");
        }
      } catch (err) {
        console.error("[OAuth Callback] Session fetch failed:", err);
        router.replace("/login?error=oauth_failed");
      }
    };

    handleCallback();
  }, [router, setUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-mute">Signing you in...</p>
    </div>
  );
}
