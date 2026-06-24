"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn } from "lucide-react";
import { authService } from "@/services/authService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getDashboardRoute } from "@/constants/routes";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data?.token) {
        // Store JWT token
        localStorage.setItem("token", response.data.token);

        toast.success(
          `Welcome back, ${response.data.user?.name?.split(" ")[0] || "back"}!`,
        );

        const redirect = searchParams.get("redirect");
        router.push(
          redirect ||
            getDashboardRoute(response.data.user?.role || "collaborator"),
        );
      } else {
        toast.error(response.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
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
          type="password"
          placeholder="••••••••"
          leftIcon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between">
          <Link href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={submitting}
          leftIcon={LogIn}
          className="rounded-full"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-mute">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}
