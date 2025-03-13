"use client";
// 6:56:20
import type React from "react";

import { currentUser } from "@/lib/auth";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Toaster } from "@/components/ui/sonner";
import { ThemeSwitch } from "../theme-switch";
import { settings } from "@/actions/settings";
import { useSession } from "next-auth/react";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function SettingsForm() {
  const user = useSession()?.data?.user;
  const [avatar, setAvatar] = useState<string>(
    "/placeholder.svg?height=100&width=100",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      await settings({ name: "Juan pepe" });
    });
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: `${user?.name}`,
      email: `${user?.email}`,
    },
  });

  return (
    <Card className="w-full">
      <CardHeader className="center flex flex-row justify-between">
        <CardTitle>Settings</CardTitle>
        <ThemeSwitch />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <div className="group relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user?.image ?? avatar}
                    alt="Profile picture"
                  />
                  <AvatarFallback>NP</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
                    disabled={isUploading}
                  />
                </div>
              </div>
              <div className="w-full flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
