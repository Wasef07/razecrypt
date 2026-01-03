"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { GoogleIcon, GitHubIcon } from "@/components/icons";

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Clean callbackUrl from the address bar
  useEffect(() => {
    if (searchParams.get("callbackUrl")) {
      router.replace("/sign-in");
    }
  }, [searchParams, router]);

  // 🔐 Credentials login
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Signed in successfully");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-card border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        {/* 🔵 OAuth Buttons */}
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <GitHubIcon className="h-5 w-5" />
          Continue with GitHub
        </Button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>

        {/* 🔐 Credentials Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <a href="/sign-up" className="underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
