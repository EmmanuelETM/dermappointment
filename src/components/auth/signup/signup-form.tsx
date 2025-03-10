"use client";

import type React from "react";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GalleryVerticalEnd,
  Lock,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThemeSwitch } from "@/components/theme-switch";

import Link from "next/link";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/schemas";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { GoogleAuth } from "@/components/auth/google-auth";
import { signup } from "@/actions/auth/signup";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      gender: "",
      image: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    console.log("submit");
    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await signup(values);
      setError(response.error);
      setSuccess(response.success);
    });
  };

  const nextStep = async () => {
    const fieldsToValidate: Array<keyof z.infer<typeof SignUpSchema>> =
      step === 1
        ? ["name", "email", "password"]
        : step === 2
          ? ["address", "gender"]
          : [];

    const isValid = await form.trigger(fieldsToValidate); // Solo valida los campos visibles
    if (!isValid) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <a className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        DermAppointment
      </a>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-10">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <ThemeSwitch />
          </div>
          <div className="mb-4 flex items-center justify-between gap-2">
            <CardDescription>
              {step === 1 && "Create your login credentials"}
              {step === 2 && "Tell us about yourself"}
              {step === 3 && "Add your profile image"}
              &nbsp; &nbsp;
            </CardDescription>
            <div className="flex items-center space-x-1">
              <StepIndicator
                currentStep={step}
                stepNumber={1}
                icon={<Lock size={16} />}
              />
              <StepIndicator
                currentStep={step}
                stepNumber={2}
                icon={<MapPin size={16} />}
              />
            </div>
          </div>
          {step === 1 && (
            <div className="pt-3">
              <GoogleAuth text="Sign Up" />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <Form {...form}>
          <form>
            <CardContent className="mt-0">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="space-y-2">
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
                                placeholder="john.doe@example.com"
                                type="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="space-y-2">
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
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={isPending}
                              placeholder="123 Main St, City, Country"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>
                  <div className="space-y-2">
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
              )}
            </CardContent>
          </form>
        </Form>
        <CardFooter className="flex flex-col space-y-4">
          {step === 2 && (
            <div className="w-full">
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
          )}
          <div className="flex w-full flex-col justify-between space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < 2 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="w-full sm:w-auto"
              >
                Continue
              </Button>
            )}
          </div>
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {"Already have an account? "}
              <Link href="/login" className="text-primary hover:underline">
                Log In
              </Link>
            </span>
          </div>
        </CardFooter>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

function StepIndicator({
  currentStep,
  stepNumber,
  icon,
}: {
  currentStep: number;
  stepNumber: number;
  icon: React.ReactNode;
}) {
  const isActive = currentStep === stepNumber;
  const isCompleted = currentStep > stepNumber;

  return (
    <div className="flex items-center">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          isCompleted
            ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
            : isActive
              ? "border-2 border-primary bg-background text-primary dark:border-primary dark:bg-background dark:text-primary"
              : "border-2 border-muted bg-background text-muted-foreground dark:border-muted dark:bg-background dark:text-muted-foreground"
        }`}
      >
        {isCompleted ? <CheckCircle2 size={16} /> : icon}
      </div>
      {stepNumber < 2 && (
        <div
          className={`h-1 w-3 ${isCompleted ? "bg-primary dark:bg-primary" : "bg-muted dark:bg-muted"}`}
        />
      )}
    </div>
  );
}
