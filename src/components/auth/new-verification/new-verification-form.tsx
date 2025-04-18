"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/auth/new-verification";
import { useTheme } from "next-themes";
import { BarLoader } from "react-spinners";
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";
import { GalleryVerticalEnd } from "lucide-react";

export function NewVerificationForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing Token");
    }
    newVerification(token!)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <a className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        DermAppointment
      </a>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">
            Confirming your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-6">
              {!success && !error && (
                <BarLoader color={theme === "dark" ? "white" : "black"} />
              )}
              <div className="flex-1">
                <FormSuccess message={success} />
                <FormError message={error} />
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-6">
            <Button onClick={() => redirect(callbackUrl!)} className="w-full">
              Go back to App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
