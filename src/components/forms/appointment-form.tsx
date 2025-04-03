"use client";

import { AppointmentFormSchema } from "@/schemas/appointment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Link from "next/link";

{
  /* <FormField
control={form.control}
name="name"
render={({ field }) => (
  <FormItem>
    <FormLabel>Name</FormLabel>
    <FormControl>
      <Input
        {...field}
        // disabled={isPending}
        placeholder="Botox"
        type="text"
        className="col-span-3"
      />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>
<FormField
control={form.control}
name="description"
render={({ field }) => (
  <FormItem>
    <FormLabel>Description</FormLabel>
    <FormControl>
      <Textarea
        {...field}
        // disabled={isPending}
        className="col-span-3"
      />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>
<div className="flex justify-end gap-2">
<Button asChild variant="outline">
  <Link href="/patients/appointments">Cancel</Link>
</Button>
</div> */
}

export function AppointmentForm() {
  const form = useForm<z.infer<typeof AppointmentFormSchema>>({
    resolver: zodResolver(AppointmentFormSchema),
  });

  function onSubmit(values: z.infer<typeof AppointmentFormSchema>) {
    console.log(values);
  }

  return <div>Appointment Form</div>;

  // return (
  //   <>
  //     <Form {...form}>
  //       <Form {...form}>
  //         <form onSubmit={form.handleSubmit(onSubmit)}>
  //           <div className="mt-4 grid gap-6">
  //             <div className="grid gap-2">
  //               <FormField
  //                 control={form.control}
  //                 name="startTime"
  //                 render={({ field }) => (
  //                   <FormItem>
  //                     <FormLabel>Name</FormLabel>
  //                     <FormControl>
  //                       <Input
  //                         {...field}
  //                         // disabled={isPending}
  //                         type="date"
  //                         className="col-span-3"
  //                       />
  //                     </FormControl>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />
  //             </div>
  //             <div className="mb-4 grid gap-2">
  //               <FormField
  //                 control={form.control}
  //                 name="description"
  //                 render={({ field }) => (
  //                   <FormItem>
  //                     <FormLabel>Description</FormLabel>
  //                     <FormControl>
  //                       <Textarea
  //                         {...field}
  //                         // disabled={isPending}
  //                         className="col-span-3"
  //                       />
  //                     </FormControl>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />
  //             </div>
  //           </div>
  //           <div className="flex justify-end gap-2">
  //             <Button type="button" asChild variant="outline">
  //               <Link href="/patients/appointments">Cancel</Link>
  //             </Button>
  //             <Button type="submit">Save</Button>
  //           </div>
  //         </form>
  //       </Form>
  //     </Form>
  //   </>
  // );
}
