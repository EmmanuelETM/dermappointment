import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";

function LoginPage() {
  console.log("login page");
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        DermAppointment
      </a>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
