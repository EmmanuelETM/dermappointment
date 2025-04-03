"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersFormSchema } from "@/schemas/user";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createUser } from "@/actions/admin/users";

export function UsersFormDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UsersFormSchema>>({
    resolver: zodResolver(UsersFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "PATIENT",
      location: "La Vega",
      gender: "Male",
    },
  });

  const onSubmit = (values: z.infer<typeof UsersFormSchema>) => {
    startTransition(async () => {
      const response = await createUser(values);
      setOpen(false);

      if (response?.success) toast(response?.success);
      else toast(response?.error);

      form.reset();
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Procedure</DialogTitle>
            </DialogHeader>
            <div className="mt-4 grid gap-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="John Doe"
                          type="text"
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="dud@example.com"
                          type="email"
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                          placeholder="*******"
                          type="password"
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PATIENT">PATIENT</SelectItem>
                          <SelectItem value="DOCTOR">DOCTOR</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                        <FormMessage />
                      </FormItem>
                    </Select>
                  )}
                ></FormField>{" "}
              </div>
              <div className="grid gap-2">
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
                ></FormField>{" "}
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Male" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                        <FormMessage />
                      </FormItem>
                    </Select>
                  )}
                ></FormField>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit">
                <Plus />
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
