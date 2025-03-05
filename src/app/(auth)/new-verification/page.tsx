import { NewVerificationForm } from "@/components/auth/new-verification/new-verification-form";
import { Suspense } from "react";

function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVerificationForm />
    </Suspense>
  );
}

export default AuthErrorPage;
