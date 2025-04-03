warning: in the working copy of 'bun.lock', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/bun.lock b/bun.lock[m
[1mindex 6445001..e51f42d 100644[m
[1m--- a/bun.lock[m
[1m+++ b/bun.lock[m
[36m@@ -30,6 +30,7 @@[m
         "@schedule-x/scroll-controller": "^2.26.0",[m
         "@schedule-x/theme-default": "^2.26.0",[m
         "@t3-oss/env-nextjs": "^0.10.1",[m
[32m+[m[32m        "@tanstack/react-query": "^5.71.5",[m
         "@tanstack/react-table": "^8.21.2",[m
         "@types/nodemailer": "^6.4.17",[m
         "@uploadthing/react": "^7.3.0",[m
[36m@@ -38,6 +39,7 @@[m
         "clsx": "^2.1.1",[m
         "cmdk": "^1.1.1",[m
         "date-fns": "^3.6.0",[m
[32m+[m[32m        "date-fns-tz": "^3.2.0",[m
         "drizzle-orm": "^0.33.0",[m
         "geist": "^1.3.1",[m
         "googleapis": "^148.0.0",[m
[36m@@ -292,6 +294,10 @@[m
 [m
     "@t3-oss/env-nextjs": ["@t3-oss/env-nextjs@0.10.1", "", { "dependencies": { "@t3-oss/env-core": "0.10.1" }, "peerDependencies": { "typescript": ">=5.0.0", "zod": "^3.0.0" } }, ""],[m
 [m
[32m+[m[32m    "@tanstack/query-core": ["@tanstack/query-core@5.71.5", "", {}, "sha512-XOQ5SyjCdwhxyLksGKWSL5poqyEXYPDnsrZAzJm2LgrMm4Yh6VOrfC+IFosXreDw9HNqC11YAMY3HlfHjNzuaA=="],[m
[32m+[m
[32m+[m[32m    "@tanstack/react-query": ["@tanstack/react-query@5.71.5", "", { "dependencies": { "@tanstack/query-core": "5.71.5" }, "peerDependencies": { "react": "^18 || ^19" } }, "sha512-WpxZWy4fDASjY+iAaXB+aY+LC95PQ34W6EWVkjJ0hdzWWbczFnr9nHvHkVDpwdR18I1NO8igNGQJFrLrgyzI8Q=="],[m
[32m+[m
     "@tanstack/react-table": ["@tanstack/react-table@8.21.2", "", { "dependencies": { "@tanstack/table-core": "8.21.2" }, "peerDependencies": { "react": ">=16.8", "react-dom": ">=16.8" } }, "sha512-11tNlEDTdIhMJba2RBH+ecJ9l1zgS2kjmexDPAraulc8jeNA4xocSNeyzextT0XJyASil4XsCYlJmf5jEWAtYg=="],[m
 [m
     "@tanstack/table-core": ["@tanstack/table-core@8.21.2", "", {}, "sha512-uvXk/U4cBiFMxt+p9/G7yUWI/UbHYbyghLCjlpWZ3mLeIZiUBSKcUnw9UnKkdRz7Z/N4UBuFLWQdJCjUe7HjvA=="],[m
[36m@@ -476,6 +482,8 @@[m
 [m
     "date-fns": ["date-fns@3.6.0", "", {}, "sha512-fRHTG8g/Gif+kSh50gaGEdToemgfj74aRX3swtiouboip5JDLAyDE9F11nHMIcvOaXeOC6D7SpNhi7uFyB7Uww=="],[m
 [m
[32m+[m[32m    "date-fns-tz": ["date-fns-tz@3.2.0", "", { "peerDependencies": { "date-fns": "^3.0.0 || ^4.0.0" } }, "sha512-sg8HqoTEulcbbbVXeg84u5UnlsQa8GS5QXMqjjYIhS4abEVVKIUwe0/l/UhrZdKaL/W5eWZNlbTeEIiOXTcsBQ=="],[m
[32m+[m
     "debug": ["debug@4.4.0", "", { "dependencies": { "ms": "^2.1.3" } }, ""],[m
 [m
     "deep-is": ["deep-is@0.1.4", "", {}, ""],[m
[1mdiff --git a/package.json b/package.json[m
[1mindex 23461dc..cb49efb 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -47,6 +47,7 @@[m
     "@schedule-x/scroll-controller": "^2.26.0",[m
     "@schedule-x/theme-default": "^2.26.0",[m
     "@t3-oss/env-nextjs": "^0.10.1",[m
[32m+[m[32m    "@tanstack/react-query": "^5.71.5",[m
     "@tanstack/react-table": "^8.21.2",[m
     "@types/nodemailer": "^6.4.17",[m
     "@uploadthing/react": "^7.3.0",[m
[36m@@ -55,6 +56,7 @@[m
     "clsx": "^2.1.1",[m
     "cmdk": "^1.1.1",[m
     "date-fns": "^3.6.0",[m
[32m+[m[32m    "date-fns-tz": "^3.2.0",[m
     "drizzle-orm": "^0.33.0",[m
     "geist": "^1.3.1",[m
     "googleapis": "^148.0.0",[m
[1mdiff --git a/src/actions/GoogleCalendar.ts b/src/actions/GoogleCalendar.ts[m
[1mdeleted file mode 100644[m
[1mindex dfa896f..0000000[m
[1m--- a/src/actions/GoogleCalendar.ts[m
[1m+++ /dev/null[m
[36m@@ -1,16 +0,0 @@[m
[31m-"use server";[m
[31m-[m
[31m-type CalendarEventTimeProp = {[m
[31m-  userId: string;[m
[31m-  date: {[m
[31m-    start: Date;[m
[31m-    end: Date;[m
[31m-  };[m
[31m-};[m
[31m-[m
[31m-export async function getCalendarEventTimes({[m
[31m-  userId,[m
[31m-  date,[m
[31m-}: CalendarEventTimeProp) {[m
[31m-  return;[m
[31m-}[m
[1mdiff --git a/src/app/doctor/calendar/page.tsx b/src/app/doctor/calendar/page.tsx[m
[1mindex 875d6b6..d3e299b 100644[m
[1m--- a/src/app/doctor/calendar/page.tsx[m
[1m+++ b/src/app/doctor/calendar/page.tsx[m
[36m@@ -10,9 +10,11 @@[m [mexport default async function CalendarPage() {[m
     redirect("/login");[m
   }[m
 [m
[31m-  const data = await getAppointmentsData("doctorId", doctor.doctorId);[m
[31m-[m
[31m-  console.log(data);[m
[32m+[m[32m  const data = await getAppointmentsData([m
[32m+[m[32m    "doctorId",[m
[32m+[m[32m    doctor.doctorId,[m
[32m+[m[32m    "Confirmed",[m
[32m+[m[32m  );[m
 [m
   return <Calendar appointments={data} />;[m
 }[m
[1mdiff --git a/src/app/layout.tsx b/src/app/layout.tsx[m
[1mindex ff85530..cdfa051 100644[m
[1m--- a/src/app/layout.tsx[m
[1m+++ b/src/app/layout.tsx[m
[36m@@ -2,8 +2,7 @@[m [mimport "@/styles/globals.css";[m
 [m
 import { GeistSans } from "geist/font/sans";[m
 import { type Metadata } from "next";[m
[31m-import { ThemeProvider } from "@/components/theme-provider";[m
[31m-import { Toaster } from "@/components/ui/sonner";[m
[32m+[m[32mimport Providers from "./providers";[m
 import { cn } from "@/lib/utils";[m
 [m
 export const metadata: Metadata = {[m
[36m@@ -23,16 +22,7 @@[m [mexport default async function RootLayout({[m
       suppressHydrationWarning[m
     >[m
       <body className={cn("min-h-screen bg-background antialiased")}>[m
[31m-        <ThemeProvider[m
[31m-          attribute="class"[m
[31m-          defaultTheme="dark"[m
[31m-          enableSystem[m
[31m-          disableTransitionOnChange[m
[31m-        >[m
[31m-          {children}[m
[31m-[m
[31m-          <Toaster />[m
[31m-        </ThemeProvider>[m
[32m+[m[32m        <Providers>{children} </Providers>[m
       </body>[m
     </html>[m
   );[m
[1mdiff --git a/src/app/patient/appointments/new/AppointmentTabs.tsx b/src/app/patient/appointments/new/AppointmentTabs.tsx[m
[1mindex 37cf938..5e5b779 100644[m
[1m--- a/src/app/patient/appointments/new/AppointmentTabs.tsx[m
[1m+++ b/src/app/patient/appointments/new/AppointmentTabs.tsx[m
[36m@@ -18,12 +18,20 @@[m [mimport { DataTable } from "@/components/tables/data-table";[m
 import { useEffect, useState } from "react";[m
 import { useCurrentUser } from "@/hooks/user-current-user";[m
 import { useForm } from "react-hook-form";[m
[32m+[m[32mimport { useQuery } from "@tanstack/react-query";[m
 [m
 import { type Procedure } from "@/schemas/admin/procedures";[m
 import { type Doctor } from "@/schemas/doctor";[m
 [m
 import { getColumns } from "./columns";[m
 import { formatDurationDescription } from "@/lib/formatters";[m
[32m+[m[32mimport {[m
[32m+[m[32m  addMonths,[m
[32m+[m[32m  eachMinuteOfInterval,[m
[32m+[m[32m  endOfDay,[m
[32m+[m[32m  roundToNearestMinutes,[m
[32m+[m[32m} from "date-fns";[m
[32m+[m[32mimport { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";[m
 [m
 export function AppointmentTabs({[m
   doctors,[m
[36m@@ -53,6 +61,41 @@[m [mexport function AppointmentTabs({[m
     }[m
   }, [doctor]);[m
 [m
[32m+[m[32m  //React Query[m
[32m+[m[32m  const {[m
[32m+[m[32m    data: availableTimes,[m
[32m+[m[32m    isLoading,[m
[32m+[m[32m    error,[m
[32m+[m[32m  } = useQuery({[m
[32m+[m[32m    queryKey: [[m
[32m+[m[32m      "availableTimes",[m
[32m+[m[32m      selectedDoctor?.doctorId,[m
[32m+[m[32m      selectedProcedure?.id,[m
[32m+[m[32m    ],[m
[32m+[m[32m    queryFn: async () => {[m
[32m+[m[32m      if (!selectedDoctor || !selectedProcedure) return [];[m
[32m+[m
[32m+[m[32m      const startDate = roundToNearestMinutes(new Date(), {[m
[32m+[m[32m        nearestTo: 15,[m
[32m+[m[32m        roundingMethod: "ceil",[m
[32m+[m[32m      });[m
[32m+[m[32m      const endDate = endOfDay(addMonths(startDate, 2));[m
[32m+[m
[32m+[m[32m      const validTimes = await getValidTimesFromSchedule([m
[32m+[m[32m        eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),[m
[32m+[m[32m        selectedProcedure,[m
[32m+[m[32m        selectedDoctor.doctorId,[m
[32m+[m[32m      );[m
[32m+[m
[32m+[m[32m      if (validTimes.length === 0) {[m
[32m+[m[32m        console.log("no shenaningans");[m
[32m+[m[32m      }[m
[32m+[m
[32m+[m[32m      return validTimes;[m
[32m+[m[32m    },[m
[32m+[m[32m    enabled: !!selectedDoctor && !!selectedProcedure,[m
[32m+[m[32m  });[m
[32m+[m
   return ([m
     <Tabs[m
       value={[m
[36m@@ -192,31 +235,21 @@[m [mexport function AppointmentTabs({[m
   );[m
 }[m
 [m
[31m-// id: varchar("id", { length: 255 })[m
[31m-//   .notNull()[m
[31m-//   .primaryKey()[m
[31m-//   .$defaultFn(() => crypto.randomUUID()),[m
[31m-// userId: varchar("user_id", { length: 255 })[m
[31m-//   .notNull()[m
[31m-//   .references(() => users.id),[m
[31m-// doctorId: varchar("doctor_id", { length: 255 })[m
[31m-//   .notNull()[m
[31m-//   .references(() => doctors.id),[m
[31m-// procedureId: varchar("procedure_id", { length: 255 })[m
[31m-//   .notNull()[m
[31m-//   .references(() => procedures.id),[m
[31m-// date: timestamp("date", { mode: "date" }),[m
[31m-// duration: integer("duration").notNull(),[m
[31m-// location: Location("location").notNull(),[m
[31m-// reason: text("reason"),[m
[31m-// status: varchar("status", { length: 20 }).notNull().default("pending"),[m
[31m-// createdAt,[m
[31m-// updatedAt,[m
[31m-[m
[31m-//   <div className="container mx-auto px-4">[m
[31m-//     <div className="mb-2 flex items-center justify-between">[m
[31m-//       <p className="py-2 text-lg font-bold">Procedures</p>[m
[31m-//       <ProceduresFormDialog />[m
[31m-//     </div>[m
[31m-//     <DataTable columns={columns} data={data} filter="name" />[m
[31m-//   </div>[m
[32m+[m[32m// if (selectedProcedure) {[m
[32m+[m[32m//   const startDate = roundToNearestMinutes(new Date(), {[m
[32m+[m[32m//     nearestTo: 15,[m
[32m+[m[32m//     roundingMethod: "ceil",[m
[32m+[m[32m//   });[m
[32m+[m[32m//   const endDate = endOfDay(addMonths(startDate, 2));[m
[32m+[m
[32m+[m[32m//   const fetchValidTimes = async () => {[m
[32m+[m[32m//     const times = await getValidTimesFromSchedule([m
[32m+[m[32m//       eachMinuteOfInterval([m
[32m+[m[32m//         { start: startDate, end: endDate },[m
[32m+[m[32m//         { step: 15 },[m
[32m+[m[32m//       ),[m
[32m+[m[32m//       selectedProcedure,[m
[32m+[m[32m//       selectedDoctor!.doctorId,[m
[32m+[m[32m//     );[m
[32m+[m[32m//   };[m
[32m+[m[32m// }[m
[1mdiff --git a/src/components/forms/appointment-form.tsx b/src/components/forms/appointment-form.tsx[m
[1mindex f439eb4..3d70271 100644[m
[1m--- a/src/components/forms/appointment-form.tsx[m
[1m+++ b/src/components/forms/appointment-form.tsx[m
[36m@@ -70,62 +70,63 @@[m [mexport function AppointmentForm() {[m
     console.log(values);[m
   }[m
 [m
[31m-  return ([m
[31m-    <>[m
[31m-      <Form {...form}>[m
[31m-        <Form {...form}>[m
[31m-          <form onSubmit={form.handleSubmit(onSubmit)}>[m
[31m-            <div className="mt-4 grid gap-6">[m
[31m-              <div className="grid gap-2">[m
[31m-                <FormField[m
[31m-                  control={form.control}[m
[31m-                  name="name"[m
[31m-                  render={({ field }) => ([m
[31m-                    <FormItem>[m
[31m-                      <FormLabel>Name</FormLabel>[m
[31m-                      <FormControl>[m
[31m-                        <Input[m
[31m-                          {...field}[m
[31m-                          // disabled={isPending}[m
[31m-                          placeholder="Botox"[m
[31m-                          type="text"[m
[31m-                          className="col-span-3"[m
[31m-                        />[m
[31m-                      </FormControl>[m
[31m-                      <FormMessage />[m
[31m-                    </FormItem>[m
[31m-                  )}[m
[31m-                />[m
[31m-              </div>[m
[31m-              <div className="mb-4 grid gap-2">[m
[31m-                <FormField[m
[31m-                  control={form.control}[m
[31m-                  name="description"[m
[31m-                  render={({ field }) => ([m
[31m-                    <FormItem>[m
[31m-                      <FormLabel>Description</FormLabel>[m
[31m-                      <FormControl>[m
[31m-                        <Textarea[m
[31m-                          {...field}[m
[31m-                          // disabled={isPending}[m
[31m-                          className="col-span-3"[m
[31m-                        />[m
[31m-                      </FormControl>[m
[31m-                      <FormMessage />[m
[31m-                    </FormItem>[m
[31m-                  )}[m
[31m-                />[m
[31m-              </div>[m
[31m-            </div>[m
[31m-            <div className="flex justify-end gap-2">[m
[31m-              <Button type="button" asChild variant="outline">[m
[31m-                <Link href="/patients/appointments">Cancel</Link>[m
[31m-              </Button>[m
[31m-              <Button type="submit">Save</Button>[m
[31m-            </div>[m
[31m-          </form>[m
[31m-        </Form>[m
[31m-      </Form>[m
[31m-    </>[m
[31m-  );[m
[32m+[m[32m  return <div>Appointment Form</div>;[m
[32m+[m
[32m+[m[32m  // return ([m
[32m+[m[32m  //   <>[m
[32m+[m[32m  //     <Form {...form}>[m
[32m+[m[32m  //       <Form {...form}>[m
[32m+[m[32m  //         <form onSubmit={form.handleSubmit(onSubmit)}>[m
[32m+[m[32m  //           <div className="mt-4 grid gap-6">[m
[32m+[m[32m  //             <div className="grid gap-2">[m
[32m+[m[32m  //               <FormField[m
[32m+[m[32m  //                 control={form.control}[m
[32m+[m[32m  //                 name="startTime"[m
[32m+[m[32m  //                 render={({ field }) => ([m
[32m+[m[32m  //                   <FormItem>[m
[32m+[m[32m  //                     <FormLabel>Name</FormLabel>[m
[32m+[m[32m  //                     <FormControl>[m
[32m+[m[32m  //                       <Input[m
[32m+[m[32m  //                         {...field}[m
[32m+[m[32m  //                         // disabled={isPending}[m
[32m+[m[32m  //                         type="date"[m
[32m+[m[32m  //                         className="col-span-3"[m
[32m+[m[32m  //                       />[m
[32m+[m[32m  //                     </FormControl>[m
[32m+[m[32m  //                     <FormMessage />[m
[32m+[m[32m  //                   </FormItem>[m
[32m+[m[32m  //                 )}[m
[32m+[m[32m  //               />[m
[32m+[m[32m  //             </div>[m
[32m+[m[32m  //             <div className="mb-4 grid gap-2">[m
[32m+[m[32m  //               <FormField[m
[32m+[m[32m  //                 control={form.control}[m
[32m+[m[32m  //                 name="description"[m
[32m+[m[32m  //                 render={({ field }) => ([m
[32m+[m[32m  //                   <FormItem>[m
[32m+[m[32m  //                     <FormLabel>Description</FormLabel>[m
[32m+[m[32m  //                     <FormControl>[m
[32m+[m[32m  //                       <Textarea[m
[32m+[m[32m  //                         {...field}[m
[32m+[m[32m  //                         // disabled={isPending}[m
[32m+[m[32m  //                         className="col-span-3"[m
[32m+[m[32m  //                       />[m
[32m+[m[32m  //                     </FormControl>[m
[32m+[m[32m  //                     <FormMessage />[m
[32m+[m[32m  //                   </FormItem>[m
[32m+[m[32m  //                 )}[m
[32m+[m[32m  //               />[m
[32m+[m[32m  //             </div>[m
[32m+[m[32m  //           </div>[m
[32m+[m[32m  //           <div className="flex justify-end gap-2">[m
[32m+[m[32m  //             <Button type="button" asChild variant="outline">[m
[32m+[m[32m  //               <Link href="/patients/appointments">Cancel</Link>[m
[32m+[m[32m  //             </Button>[m
[32m+[m[32m  //             <Button type="submit">Save</Button>[m
[32m+[m[32m  //           </div>[m
[32m+[m[32m  //         </form>[m
[32m+[m[32m  //       </Form>[m
[32m+[m[32m  //     </Form>[m
[32m+[m[32m  //   </>[m
[32m+[m[32m  // );[m
 }[m
[1mdiff --git a/src/data/appointments.ts b/src/data/appointments.ts[m
[1mindex ea46964..e16b8ab 100644[m
[1m--- a/src/data/appointments.ts[m
[1m+++ b/src/data/appointments.ts[m
[36m@@ -1,19 +1,16 @@[m
[31m-"use server";[m
[31m-[m
 import { type Appointment } from "@/schemas/appointment";[m
 import { db } from "@/server/db";[m
 import { appointment } from "@/server/db/schema";[m
 import { and, eq } from "drizzle-orm";[m
[32m+[m[32mimport { APPOINTMENT_STATUS } from "./constants";[m
 [m
 const getAppointments = async ([m
   filterKey: "doctorId" | "userId",[m
   id: string,[m
[32m+[m[32m  status: (typeof APPOINTMENT_STATUS)[number],[m
 ) => {[m
   const data = await db.query.appointment.findMany({[m
[31m-    where: and([m
[31m-      eq(appointment[filterKey], id),[m
[31m-      eq(appointment.status, "Confirmed"),[m
[31m-    ),[m
[32m+[m[32m    where: and(eq(appointment[filterKey], id), eq(appointment.status, status)),[m
     with: {[m
       doctors: {[m
         columns: {},[m
[36m@@ -52,8 +49,9 @@[m [mconst getAppointments = async ([m
 export async function getAppointmentsData([m
   filterKey: "doctorId" | "userId",[m
   id: string,[m
[32m+[m[32m  status: (typeof APPOINTMENT_STATUS)[number],[m
 ): Promise<Appointment[]> {[m
[31m-  const data = await getAppointments(filterKey, id);[m
[32m+[m[32m  const data = await getAppointments(filterKey, id, status);[m
 [m
   const flatten = data.map((appointment) => ({[m
     id: appointment.id,[m
[1mdiff --git a/src/data/doctors.ts b/src/data/doctors.ts[m
[1mindex 72c43e2..be29a57 100644[m
[1m--- a/src/data/doctors.ts[m
[1m+++ b/src/data/doctors.ts[m
[36m@@ -1,5 +1,3 @@[m
[31m-"use server";[m
[31m-[m
 import { type Doctor } from "@/schemas/doctor";[m
 import { db } from "@/server/db";[m
 import { users } from "@/server/db/schema";[m
[1mdiff --git a/src/schemas/appointment.ts b/src/schemas/appointment.ts[m
[1mindex 775480e..5a39f11 100644[m
[1m--- a/src/schemas/appointment.ts[m
[1m+++ b/src/schemas/appointment.ts[m
[36m@@ -2,30 +2,44 @@[m [mimport { APPOINTMENT_STATUS, LOCATION } from "@/data/constants";[m
 import { z } from "zod";[m
 [m
 export const AppointmentFormSchema = z.object({[m
[31m-  userId: z.string(),[m
[31m-  doctorId: z.string(),[m
[31m-  procedureId: z.string(),[m
[31m-[m
[31m-  name: z.string().min(1, "Required"),[m
[32m+[m[32m  startTime: z.date(),[m
[32m+[m[32m  endTime: z.date(),[m
   description: z.string().optional(),[m
[31m-  status: z.boolean().default(true),[m
[31m-  durationInMinutes: z.coerce[m
[31m-    .number()[m
[31m-    .int()[m
[31m-    .positive("Duration must be greater than 0")[m
[31m-    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),[m
 });[m
 [m
[32m+[m[32m// export const appointment = createTable("appointment", {[m
[32m+[m[32m//   id: varchar("id", { length: 255 })[m
[32m+[m[32m//     .notNull()[m
[32m+[m[32m//     .primaryKey()[m
[32m+[m[32m//     .$defaultFn(() => crypto.randomUUID()),[m
[32m+[m[32m//   userId: varchar("user_id", { length: 255 })[m
[32m+[m[32m//     .notNull()[m
[32m+[m[32m//     .references(() => users.id),[m
[32m+[m[32m//   doctorId: varchar("doctor_id", { length: 255 })[m
[32m+[m[32m//     .notNull()[m
[32m+[m[32m//     .references(() => doctors.id),[m
[32m+[m[32m//   procedureId: varchar("procedure_id", { length: 255 })[m
[32m+[m[32m//     .notNull()[m
[32m+[m[32m//     .references(() => procedures.id),[m
[32m+[m[32m//   startTime: timestamp("start_time").notNull(),[m
[32m+[m[32m//   endTime: timestamp("end_time").notNull(),[m
[32m+[m[32m//   location: Location("location").notNull(),[m
[32m+[m[32m//   description: text("description"),[m
[32m+[m[32m//   status: status("status").default("Pending").notNull(),[m
[32m+[m[32m//   createdAt,[m
[32m+[m[32m//   updatedAt,[m
[32m+[m[32m// });[m
[32m+[m
 export const AppointmentSchema = z.object({[m
[31m-  id: z.string().nullable(),[m
[31m-  startTime: z.date().nullable(),[m
[31m-  endTime: z.date().nullable(),[m
[32m+[m[32m  id: z.string(),[m
[32m+[m[32m  startTime: z.date(),[m
[32m+[m[32m  endTime: z.date(),[m
   patient: z.string().nullable(),[m
   doctor: z.string().nullable(),[m
   procedure: z.string().nullable(),[m
[31m-  location: z.enum(LOCATION).nullable(),[m
[32m+[m[32m  location: z.enum(LOCATION),[m
   description: z.string().nullable(),[m
[31m-  status: z.enum(APPOINTMENT_STATUS).nullable(),[m
[32m+[m[32m  status: z.enum(APPOINTMENT_STATUS),[m
 });[m
 [m
 export type Appointment = z.infer<typeof AppointmentSchema>;[m
[1mdiff --git a/src/server/db/schema.ts b/src/server/db/schema.ts[m
[1mindex a4bb23c..cef6fcf 100644[m
[1m--- a/src/server/db/schema.ts[m
[1m+++ b/src/server/db/schema.ts[m
[36m@@ -298,7 +298,7 @@[m [mexport const appointment = createTable("appointment", {[m
   endTime: timestamp("end_time").notNull(),[m
   location: Location("location").notNull(),[m
   description: text("description"),[m
[31m-  status: status("status").default("Pending"),[m
[32m+[m[32m  status: status("status").default("Pending").notNull(),[m
   createdAt,[m
   updatedAt,[m
 });[m
