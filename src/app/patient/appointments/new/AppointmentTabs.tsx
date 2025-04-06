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

import { Button } from "@/components/ui/button";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useCurrentUser } from "@/hooks/user-current-user";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { type Procedure } from "@/schemas/admin/procedures";
import { type Doctor } from "@/schemas/doctor";

import { HashLoader } from "react-spinners";

import { formatDate, formatTimeToString } from "@/lib/formatters";

import {
  addMonths,
  eachMinuteOfInterval,
  endOfDay,
  isSameDay,
  roundToNearestMinutes,
} from "date-fns";

import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";

import { AppointmentFormSchema } from "@/schemas/appointment";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/auth/form-error";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Frown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toZonedTime } from "date-fns-tz";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

import { createAppointment } from "@/actions/appointments/createAppointment";
import { toast } from "sonner";
import { type LOCATION } from "@/data/constants";
import { DoctorTab } from "./tabs/Doctor";
import { ProcedureTab } from "./tabs/Procedure";

import { useSearchParams } from "next/navigation";

export function AppointmentTabs({ doctors }: { doctors: Doctor[] }) {
  const user = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctor");

  //filter logic
  if (doctorId) {
    console.log(doctorId);
  }

  if (!user || !user.id) {
    router.push("/login");
  }

  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null,
  );
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof LOCATION)[number]
  >(user!.location as (typeof LOCATION)[number]);

  const [formError, setFormError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  //Form stuff

  const form = useForm<z.infer<typeof AppointmentFormSchema>>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      timezone: "America/Santo_Domingo",
      location:
        user!.location === "La Vega" || user!.location === "Puerto Plata"
          ? user!.location
          : "La Vega",
    },
  });

  const timezone = form.watch("timezone");
  const date = form.watch("date");
  const time = form.watch("startTime");

  function onSubmit(values: z.infer<typeof AppointmentFormSchema>) {
    setFormError("");
    startTransition(async () => {
      const response = await createAppointment({
        ...values,
        doctorId: selectedDoctor!.doctorId,
        userId: user!.id ?? "",
        procedure: selectedProcedure!,
      });
      if (response?.success) {
        toast(response?.success);
        router.push("/patient/appointments/");
      }

      if (response?.error) setFormError(response?.error);
    });
  }

  //Data fetching stuff

  // useEffect(() => {
  //   if (doctor) {
  //     setSelectedDoctor(doctor);
  //     setCurrentStep(2);
  //   }
  // }, [doctor, user]);

  const {
    data: availableTimes,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "availableTimes",
      selectedDoctor?.doctorId,
      selectedProcedure?.id,
      selectedLocation,
    ],
    queryFn: async () => {
      if (!selectedDoctor || !selectedProcedure) return [];

      const startDate = roundToNearestMinutes(new Date(), {
        nearestTo: 15,
        roundingMethod: "ceil",
      });
      const endDate = endOfDay(addMonths(startDate, 2));

      const validTimes = await getValidTimesFromSchedule(
        eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
        selectedProcedure,
        selectedDoctor.doctorId,
        selectedLocation,
      );

      if (validTimes.length === 0) {
        setFormError("No availabilities for this Doctor");
        return;
      }

      return validTimes;
    },
    enabled: !!selectedDoctor && !!selectedProcedure && !!selectedLocation,
  });

  if (error) setFormError(error.message);

  //Date, time and availabiliteis stuff

  const validTimesInTimezone = useMemo(() => {
    return availableTimes?.map((date) => toZonedTime(date, timezone));
  }, [availableTimes, timezone]);

  const timesForSelectedDate =
    validTimesInTimezone?.filter((time) => isSameDay(time, date)) ?? [];

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
            disabled={currentStep < tab.step || isPending}
          >
            <span className="block sm:hidden">{tab.step}</span>
            <span className="hidden sm:block">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1 */}
          <TabsContent value="doctor">
            <DoctorTab
              doctors={doctors}
              setCurrentStepAction={setCurrentStep}
              setSelectedDoctorAction={setSelectedDoctor}
              setSelectedProcedureAction={setSelectedProcedure}
            />
          </TabsContent>

          {/* Step 2 */}
          <TabsContent value="procedure">
            <ProcedureTab
              selectedDoctor={selectedDoctor}
              setSelectedProcedureAction={setSelectedProcedure}
              setCurrentStepAction={setCurrentStep}
            />
          </TabsContent>

          {/* Step 3 */}

          {/* Form stuff from here on down */}

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Appointment Details
                </CardTitle>
                <CardDescription className="text-md">
                  Set up Date, Time and more.
                </CardDescription>
              </CardHeader>

              <div className="mb-6 w-full px-6">
                <FormError message={formError} />
              </div>
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
                              defaultValue={"America/Santo_Domingo"}
                              disabled={isPending}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={"America/Santo_Domingo"}>
                                  America/Santo_Domingo
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedLocation(
                                  value as (typeof LOCATION)[number],
                                );
                              }}
                              defaultValue={field.value}
                              disabled={isPending}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="La Vega">La Vega</SelectItem>
                                <SelectItem value="Puerto Plata">
                                  Puerto Plata
                                </SelectItem>
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
                                  <FormLabel>Date</FormLabel>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        disabled={isPending}
                                        variant="outline"
                                        className={cn(
                                          "flex w-full pl-3 text-left font-normal",
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
                                        ) || isPending
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                  <FormMessage />
                                </FormItem>
                              </Popover>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                              <FormItem className="flex flex-1 flex-col">
                                <FormLabel>Time</FormLabel>
                                <Select
                                  disabled={
                                    date == null ||
                                    timezone == null ||
                                    isPending
                                  }
                                  onValueChange={(value) =>
                                    field.onChange(new Date(Date.parse(value)))
                                  }
                                  defaultValue={field.value?.toISOString()}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue
                                        placeholder={
                                          date == null || timezone == null
                                            ? "Select a date first"
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
                                    {timesForSelectedDate.length === 0 ? (
                                      <SelectItem value="nofin" disabled>
                                        No Available Times for this Date
                                      </SelectItem>
                                    ) : (
                                      timesForSelectedDate.map((time) => (
                                        <SelectItem
                                          key={time.toISOString()}
                                          value={time.toISOString()}
                                        >
                                          {formatTimeToString(time)}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          disabled={isPending}
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
                <div className="flex flex-col items-center justify-center gap-4 py-4 text-xl font-semibold">
                  No Schedule Available for this Doctor
                  <Frown size={48} />
                </div>
              )}
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button
                  disabled={time != null ? false : true}
                  onClick={() => setCurrentStep(4)}
                >
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Step 4 */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Payment</CardTitle>
                <CardDescription className="text-md">
                  Pay the reservation for the Appointment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">Check everything</CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setCurrentStep(3)}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isPending}>
                  Finish
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Form>
    </Tabs>
  );
}
