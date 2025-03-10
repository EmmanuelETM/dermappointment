"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { getDefaultRedirect } from "@/routes";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function handleRedirect() {
      const session = await getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const redirectTo = getDefaultRedirect(session?.user.role as string);
      if (redirectTo) {
        router.replace(redirectTo);
      }
    }

    void handleRedirect();
  }, [router]);

  return <p className="text-center text-lg font-semibold">Redirecting...</p>;
}
