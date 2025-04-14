"use client";

import { useForm } from "react-hook-form";
import { ThemeSwitch } from "@/components/theme-switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { type z } from "zod";
import { SettingsSchema } from "@/schemas/auth";
import { settings } from "@/actions/auth/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LOCATION } from "@/data/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const UserSettings = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const isUploading = false;
  const [isPending, startTransition] = useTransition();
  const avatar = user?.image ?? "";

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      newPassword: "",
      location: (user?.location as (typeof LOCATION)[number]) ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "" && v !== undefined),
      );

      try {
        const response = await settings(filteredValues);

        if (response.error) setError(response.error);

        if (response.success) {
          await update();
          setSuccess(response.success);
        }
      } catch {
        setError("Something went wrong!");
      }
    });
  };
  return (
    <Card className="w-full">
      <CardHeader className="center flex flex-row justify-between">
        <CardTitle>User Settings</CardTitle>
        <ThemeSwitch />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <div className="w-full flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user?.isOauth === false && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              disabled={isPending}
                              {...field}
                            />
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
                            <Input
                              placeholder="********"
                              type="password"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="********"
                              type="password"
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="La Vega" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="La Vega">La Vega</SelectItem>
                          <SelectItem value="Puerto Plata">
                            Puerto Plata
                          </SelectItem>
                        </SelectContent>
                        <FormMessage />
                      </FormItem>
                    </Select>
                  )}
                ></FormField>
              </div>
              <div className="group relative text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatar} alt="Profile picture" />
                  <AvatarFallback>NP</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/40">
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                      <Camera className="h-5 w-5 text-white" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading || isPending}
                  />
                </div>
              </div>
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="flex justify-start">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
