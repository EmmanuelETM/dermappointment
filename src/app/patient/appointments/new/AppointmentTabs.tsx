"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/tables/data-table";
import { getColumns } from "./columns";

import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/user-current-user";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { type Procedure } from "@/schemas/admin/procedures";
import { type Doctor } from "@/schemas/doctor";

import { HashLoader } from "react-spinners";

import {
  formatDate,
  formatDurationDescription,
  formatTimeToString,
  formatTimezoneOffset,
} from "@/lib/formatters";
import {
  addMonths,
  eachMinuteOfInterval,
  endOfDay,
  format,
  isSameDay,
  roundToNearestMinutes,
} from "date-fns";

import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";

import { AppointmentFormSchema } from "@/schemas/appointment";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { RELEVANT_TIMEZONES } from "@/data/constants";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toZonedTime } from "date-fns-tz";
import { Textarea } from "@/components/ui/textarea";

export function AppointmentTabs({
  doctors,
  doctor,
}: {
  doctors: Doctor[];
  doctor?: Doctor;
}) {
  const user = useCurrentUser();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null,
  );
  const columns = getColumns(
    setSelectedDoctor,
    setSelectedProcedure,
    setCurrentStep,
  );

  useEffect(() => {
    if (doctor) {
      setSelectedDoctor(doctor);
      setCurrentStep(2);
    }
  }, [doctor]);

  //React Query
  const {
    data: availableTimes,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "availableTimes",
      selectedDoctor?.doctorId,
      selectedProcedure?.id,
    ],
    queryFn: async () => {
      if (!selectedDoctor || !selectedProcedure) return [];

      console.log("we fetching bois");

      const startDate = roundToNearestMinutes(new Date(), {
        nearestTo: 15,
        roundingMethod: "ceil",
      });
      const endDate = endOfDay(addMonths(startDate, 2));

      const validTimes = await getValidTimesFromSchedule(
        eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
        selectedProcedure,
        selectedDoctor.doctorId,
      );

      if (validTimes.length === 0) {
        console.log("no shenaningans");
      }

      return validTimes;
    },
    enabled: !!selectedDoctor && !!selectedProcedure,
  });

  const timeZones = useMemo(() => {
    return RELEVANT_TIMEZONES.map((tz) => ({
      name: tz,
      offset: formatTimezoneOffset(tz) ?? "",
    }));
  }, []);

  const form = useForm<z.infer<typeof AppointmentFormSchema>>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  function onSubmit(values: z.infer<typeof AppointmentFormSchema>) {
    console.log(values);
  }

  const timezone = form.watch("timezone");
  const date = form.watch("date");
  const validTimesInTimezone = useMemo(() => {
    return availableTimes?.map((date) => toZonedTime(date, timezone));
  }, [availableTimes, timezone]);

  return (
    <Tabs
      value={
        currentStep === 1
          ? "doctor"
          : currentStep === 2
            ? "procedure"
            : currentStep === 3
              ? "details"
              : "payment"
      }
      className="m-2"
      onValueChange={(value) => {
        if (
          (value === "doctor" && currentStep > 1) ||
          (value === "procedure" && currentStep > 2) ||
          (value === "details" && currentStep > 3)
        ) {
          setCurrentStep(
            value === "doctor" ? 1 : value === "procedure" ? 2 : 3,
          );
        }
      }}
    >
      <TabsList className="grid w-full grid-cols-4 gap-2">
        {[
          { value: "doctor", label: "Doctor", step: 1 },
          { value: "procedure", label: "Procedure", step: 2 },
          { value: "details", label: "Details", step: 3 },
          { value: "payment", label: "Payment", step: 3 },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={currentStep < tab.step}
          >
            <span className="block sm:hidden">{tab.step}</span>
            <span className="hidden sm:block">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Step 1 */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle>Doctors</CardTitle>
                <CardDescription>Choose the doctor.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="mx-auto">
                  <DataTable columns={columns} data={doctors} filter="name" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2 */}
          <TabsContent value="procedure">
            <Card>
              <CardHeader>
                <CardTitle>Procedure</CardTitle>
                <CardDescription>Select the procedure.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedDoctor?.procedures.map((procedure) => (
                  <Card
                    key={procedure.id}
                    className="rounded-2xl border shadow-lg"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {procedure.name}
                      </CardTitle>
                      <CardDescription>
                        Duration:{" "}
                        {formatDurationDescription(procedure.duration)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-gray-600">
                      {procedure.description}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        className="w-full"
                        type="button"
                        onClick={() => {
                          setSelectedProcedure(procedure);
                          setCurrentStep((prevStep) => prevStep + 1);
                        }}
                      >
                        Select
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Step 3 */}

          {/* form stuff from here on 
          down */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Set up Date, Time and more.</CardDescription>
              </CardHeader>
              {isLoading === true ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  Loading Doctor{"'"}s Schedule
                  <HashLoader
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </div>
              ) : availableTimes?.length ? (
                <CardContent className="space-y-2">
                  <div className="flex w-full flex-col items-center gap-6 sm:flex-row">
                    <div className="w-full flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeZones.map(({ name, offset }) => (
                                  <SelectItem key={name} value={name}>
                                    {name} {offset && `(${offset})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="w-full">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <Popover>
                                <FormItem className="flex flex-1 flex-col">
                                  {" "}
                                  {/* Se agrega flex-1 */}
                                  <FormLabel>Date</FormLabel>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal", // Asegura que ocupe todo el ancho disponible
                                          !field.value &&
                                            "text-muted-foreground",
                                        )}
                                      >
                                        {field.value ? (
                                          formatDate(field.value)
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        !validTimesInTimezone!.some((time) =>
                                          isSameDay(date, time),
                                        )
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </FormItem>
                              </Popover>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem className="flex flex-1 flex-col">
                                {" "}
                                {/* Se agrega flex-1 */}
                                <FormLabel>Time</FormLabel>
                                <Select
                                  disabled={date == null || timezone == null}
                                  onValueChange={(value) =>
                                    field.onChange(new Date(Date.parse(value)))
                                  }
                                  defaultValue={field.value?.toISOString()}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      {" "}
                                      {/* Asegura ancho completo */}
                                      <SelectValue
                                        placeholder={
                                          date == null || timezone == null
                                            ? "Select a date/timezone first"
                                            : "Select an Appointment Time"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent
                                    side="bottom"
                                    align="start"
                                    className="max-h-60 overflow-auto"
                                  >
                                    {validTimesInTimezone
                                      ?.filter((time) => isSameDay(time, date))
                                      .map((time) => (
                                        <SelectItem
                                          key={time.toISOString()}
                                          value={time?.toISOString()}
                                        >
                                          {formatTimeToString(time)}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="w-full" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <div>No Schedule Available</div>
              )}

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                {availableTimes !== undefined ? (
                  <Button onClick={() => setCurrentStep(4)}>Next</Button>
                ) : (
                  <Button disabled={true}>Next</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Step 4 */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>
                  Pay the reservation for the Appointment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">Check everything</CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Back
                </Button>
                <Button onClick={() => alert("Finished!")}>Finish</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  );
}

// if (selectedProcedure) {
//   const startDate = roundToNearestMinutes(new Date(), {
//     nearestTo: 15,
//     roundingMethod: "ceil",
//   });
//   const endDate = endOfDay(addMonths(startDate, 2));

//   const fetchValidTimes = async () => {
//     const times = await getValidTimesFromSchedule(
//       eachMinuteOfInterval(
//         { start: startDate, end: endDate },
//         { step: 15 },
//       ),
//       selectedProcedure,
//       selectedDoctor!.doctorId,
//     );
//   };
// }
