"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getDashboardRoute } from "@/constants/routes";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await authService.login({ email, password });
      if (response?.token && response?.user) {
        setUser(response.user);
        toast.success(`Welcome back, ${response.user.name?.split(" ")[0] || "back"}!`);
        const redirect = searchParams.get("redirect");
        router.push(redirect || getDashboardRoute(response.user.role || "collaborator"));
      } else {
        toast.error(response?.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error(err?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    authService.loginWithGoogle();
  };

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold text-ink">Welcome back</h1>
      <p className="mt-2 text-mute">Login to your StartupForge account</p>

      <form onSubmit={handleEmailSignIn} className="mt-8 space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword((v) => !v)}
          rightIconLabel={showPassword ? "Hide password" : "Show password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between">
          <Link href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth size="lg" loading={submitting} leftIcon={LogIn} className="rounded-full">
          Sign In
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="text-xs text-ash">OR</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="btn-base mt-4 w-full border border-hairline bg-canvas px-4 py-2.5 text-sm font-bold text-ink hover:bg-surface-card rounded-full"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 0 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-mute">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
