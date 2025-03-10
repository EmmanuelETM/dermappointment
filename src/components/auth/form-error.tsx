import { TriangleAlert } from "lucide-react";

type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/35 p-2.5 text-sm text-destructive dark:text-white">
      <TriangleAlert className="h-4 w-4" />
      <p className="pt-1">{message}</p>
    </div>
  );
}
