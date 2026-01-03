"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatCardNumber } from "@/lib/formatCardNumber";

const schema = z.object({
  cardName: z.string().min(2, "Card name is required"),
  cardNumber: z.string().min(12, "Invalid card number"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date"),
  cvv: z.string().min(3, "Invalid CVV"),
});

type Values = z.infer<typeof schema>;

type Props = {
  initialData?: any;
  onSaved: () => void;
  onCancel: () => void;
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};


export default function AddCard({ initialData, onSaved, onCancel }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });


  useEffect(() => {
    if (initialData) {
      form.reset({
        cardName: initialData.cardName,
        cardNumber: initialData.cardNumber,
        expiry: `${initialData.expiryMonth}/${initialData.expiryYear}`,
        cvv: initialData.cvv,
      });
    } else {
      form.reset({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: Values) => {
    const [expiryMonth, expiryYear] = values.expiry.split("/");

    const res = await fetch("/api/cards", {
      method: initialData ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardName: values.cardName,
        cardNumber: values.cardNumber,
        expiryMonth,
        expiryYear,
        cvv: values.cvv,
        id: initialData?._id,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to save card");
      return;
    }

    toast.success(initialData ? "Card updated" : "Card added");
    form.reset();
    onSaved();
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-bold mb-4 text-center">
        {initialData ? "Edit Card" : "Add Card"}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="cardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Name</FormLabel>
                <FormControl>
                  <Input placeholder="Personal Visa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="4111 1111 1111 1111"
                    value={formatCardNumber(field.value)}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="expiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MM/YY"
                      value={formatExpiry(field.value)}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input placeholder="***" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {initialData ? "Update Card" : "Save Card"}
            </Button>

            {initialData && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
