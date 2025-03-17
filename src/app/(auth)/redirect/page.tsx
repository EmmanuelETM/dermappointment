"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import { getDefaultRedirect } from "@/routes";

export default function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    async function handleRedirect() {
      const session = await getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      //

      const redirectTo =
        callbackUrl && callbackUrl !== "null"
          ? callbackUrl
          : getDefaultRedirect(session?.user.role as string);

      if (redirectTo) {
        router.replace(redirectTo);
      }
    }

    void handleRedirect();
  }, [router, callbackUrl]);

  return <p className="text-center text-lg font-semibold">Redirecting...</p>;
}
