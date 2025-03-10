import { CircleCheck } from "lucide-react";

type FormSuccessProps = {
  message?: string;
};

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/30 p-2.5 text-sm text-emerald-600 dark:text-white">
      <CircleCheck className="h-4 w-4" />
      <p className="pt-1">{message}</p>
    </div>
  );
}
