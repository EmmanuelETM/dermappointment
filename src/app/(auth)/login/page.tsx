import { LoginForm } from "@/components/auth/login/login-form";
import { Suspense } from "react";

function LoginPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}
export default LoginPage;
