"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { newPassword } from "@/actions/auth/new-password";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function NewPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    console.log(values);

    startTransition(async () => {
      const response = await newPassword(values, token);
      setError(response?.error);
      setSuccess(response?.success);
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">New Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="********"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <FormError message={error} />
                  <FormSuccess message={success} />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    Update Password
                  </Button>
                </div>
                <div className="mt-5 text-center text-sm text-muted-foreground">
                  <Link
                    href="/login"
                    className="text-primary hover:underline hover:underline-offset-4"
                  >
                    Back to Log In
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
