"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export function AuthErrorForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">
            Oops! Something went wrong!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Button onClick={() => redirect("/login")} className="w-full">
              Go back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
