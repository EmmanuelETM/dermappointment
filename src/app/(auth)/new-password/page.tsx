import { NewPasswordForm } from "@/components/auth/new-password/new-password-form";
import { Suspense } from "react";

function NewPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
}

export default NewPasswordPage;
