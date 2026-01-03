"use client";
import * as React from "react";
import { Moon, Sun, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav
      className="flex items-center justify-between px-6 h-16
      bg-slate-900 border-b border-slate-800 text-slate-200"
    >
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-violet-500" />
        <span className="font-bold text-xl">RazeCrypt</span>
      </div>

      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={toggleTheme}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
