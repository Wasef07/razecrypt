"use client";

import { Moon, Sun, Shield, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { status } = useSession();
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isLoggedIn = status === "authenticated";

  return (
    <nav className="flex items-center justify-between px-6 h-16 bg-slate-900 border-b border-slate-800 text-slate-200">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-violet-500" />
        <span className="font-bold text-xl">RazeVault</span>
      </div>

      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={toggleTheme}>
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="h-5 w-5 hidden dark:block" />
        </Button>

        {!isLoggedIn ? (
          <>
            {/* SIGN IN */}
            <Button variant="ghost" onClick={() => signIn()}>
              Sign In
            </Button>

            {/* SIGN UP */}
            <Button
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
