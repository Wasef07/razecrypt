"use client";

import { Pencil, Trash } from "lucide-react";
import SecretField from "@/components/SecretField";

export default function PasswordItem({ password, onDelete, onEdit }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-foreground">{password.website}</h4>

        <div className="flex gap-3">
          <Pencil
            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(password)}
          />
          <Trash
            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(password._id)}
          />
        </div>
      </div>

      <div className="bg-muted rounded-lg px-4 py-3">
        <p className="text-xs text-muted-foreground">Username</p>
        <p className="text-sm text-foreground mt-2 ">{password.username}</p>
      </div>

      <div className="bg-muted rounded-lg px-4 py-3">
        <p className="text-xs text-muted-foreground">Password</p>
        <SecretField value={password.password} />
      </div>
    </div>
  );
}
