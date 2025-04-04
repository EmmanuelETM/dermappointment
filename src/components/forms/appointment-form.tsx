"use client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export function TestForm() {
  const form = useForm();

  function onSubmit() {
    console.log("submit");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-center gap-6 sm:flex-row">
          submit thy bih
        </div>
        <Button type="submit">Create shit</Button>
      </form>
    </Form>
  );
}
