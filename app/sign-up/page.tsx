"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { GoogleIcon, GitHubIcon } from "@/components/icons";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data?.error || "Signup failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-card border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

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

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
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
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <a href="/sign-in" className="underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
