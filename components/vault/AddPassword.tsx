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

const schema = z.object({
  website: z.string().min(2),
  username: z.string().min(2),
  password: z.string().min(6),
});

type Values = z.infer<typeof schema>;

type Props = {
  initialData?: any;
  onSaved: () => void;
  onCancel: () => void;
};

export default function AddPassword({ initialData, onSaved, onCancel }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        website: initialData.website,
        username: initialData.username,
        password: initialData.password,
      });
    } else {
      form.reset({
        website: "",
        username: "",
        password: "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: Values) => {
    const method = initialData ? "PUT" : "POST";

    const res = await fetch("/api/passwords", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, id: initialData?._id }),
    });

    if (!res.ok) {
      toast.error("Failed to save password");
      return;
    }

    toast.success(initialData ? "Password updated" : "Password added");
    form.reset();
    onSaved();
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-bold mb-4 text-center">
        {initialData ? "Edit Password" : "Add Password"}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="github.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username / Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit">
              {initialData ? "Update Password" : "Save Password"}
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
