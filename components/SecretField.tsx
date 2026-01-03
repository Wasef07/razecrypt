"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type SecretFieldProps = {
  value: string;
  masked?: string;
};

export default function SecretField({ value, masked }: SecretFieldProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">
        {visible ? value : masked ?? "••••••••••"}
      </span>

      <Button size="icon" variant="ghost" onClick={() => setVisible((v) => !v)}>
        {visible ? <Eye size={16} /> : <EyeOff size={16} />}
      </Button>

      <Button size="icon" variant="ghost" onClick={handleCopy}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </Button>
    </div>
  );
}
