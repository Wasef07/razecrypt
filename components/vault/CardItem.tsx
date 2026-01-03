"use client";

import { Pencil, Trash } from "lucide-react";
import SecretField from "@/components/SecretField";
import { formatCardNumber } from "@/lib/formatCardNumber";

export default function CardItem({ card, onDelete, onEdit }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-foreground">{card.cardName}</h4>
        <div className="flex gap-3">
          <Pencil
            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(card)}
          />
          <Trash
            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(card._id)}
          />
        </div>
      </div>


      <div className="space-y-1">
        
        <div className="bg-muted rounded-lg px-4 py-3">
          <p className="text-xs text-muted-foreground">Card Number</p>
          <SecretField
            value={formatCardNumber(card.cardNumber)}
            masked={`•••• •••• •••• ${card.cardNumber.slice(-4)}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg px-4 py-3 flex flex-col justify-center">
          <p className="text-xs text-muted-foreground mb-1">Expiry</p>
          <p className="font-mono text-sm">
            {card.expiryMonth}/{card.expiryYear}
          </p>
        </div>

        <div className="bg-muted rounded-lg px-4 py-3">
          <p className="text-xs text-muted-foreground">CVV</p>
          <SecretField value={card.cvv} masked="***" />
        </div>
      </div>
    </div>
  );
}
