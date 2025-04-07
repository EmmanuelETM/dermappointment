"use client";

import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import {
  EditAppointmentFormSchema,
  type FullAppointment,
} from "@/schemas/appointment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatTimeToString } from "@/lib/formatters";

import {
  addMonths,
  eachMinuteOfInterval,
  endOfDay,
  isSameDay,
  roundToNearestMinutes,
} from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { HashLoader } from "react-spinners";
import { type z } from "zod";
import { type LOCATION } from "@/data/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { toZonedTime } from "date-fns-tz";
import { CalendarIcon, Frown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/user-current-user";
import { FormError } from "@/components/auth/form-error";
import { editAppointment } from "@/actions/appointments/editAppointment";
import { toast } from "sonner";

export function EditAppointment({
  appointment,
}: {
  appointment: FullAppointment;
}) {
  const user = useCurrentUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const appointmentId = useMemo(
    () => searchParams.get("appointment"),
    [searchParams],
  );

  const [formError, setFormError] = useState<string | undefined>();
  const [selectedLocation, setSelectedLocation] =
    useState<(typeof LOCATION)[number]>();

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user || !user.id) {
      router.push("/login");
    }

    if (!appointmentId) {
      router.push("/patient/home");
    }

    if (appointment?.location) {
      setSelectedLocation(appointment.location);
    }
  }, [appointment?.location, appointmentId, router, user]);

  const form = useForm<z.infer<typeof EditAppointmentFormSchema>>({
    resolver: zodResolver(EditAppointmentFormSchema),
    defaultValues: {
      timezone: appointment?.timezone,
      location: appointment?.location || "La Vega",
      date: appointment.startTime,
      startTime: appointment.startTime,
      description: appointment?.description ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof EditAppointmentFormSchema>) {
    setFormError("");
    startTransition(async () => {
      console.log(values);
      const response = await editAppointment({
        ...values,
        appointmentId: appointment.id,
        doctorId: appointment.doctors.id,
        procedure: appointment.procedures,
      });
      if (response?.error) setFormError(response?.error);
      if (response?.success) toast(response?.success);
      return;
    });
  }

  const timezone = form.watch("timezone");
  const date = form.watch("date");
  const time = form.watch("startTime");

  const {
    data: availableTimes,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "availableTimes",
      appointment?.doctors.id,
      appointment?.procedures.id,
      selectedLocation,
    ],
    queryFn: async () => {
      if (
        !appointment?.doctors.id ||
        !appointment?.procedures.id ||
        !selectedLocation
      )
        return [];

      const startDate = roundToNearestMinutes(new Date(), {
        nearestTo: 15,
        roundingMethod: "ceil",
      });
      const endDate = endOfDay(addMonths(startDate, 2));

      const validTimes = await getValidTimesFromSchedule(
        eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
        appointment.procedures,
        appointment.doctors.id,
        selectedLocation,
      );

      if (validTimes.length === 0) {
        setFormError("No availabilities for this Doctor");
      }

      return validTimes;
    },
    enabled:
      !!appointment?.doctors.id &&
      !!appointment?.procedures?.id &&
      !!selectedLocation,
  });

  useEffect(() => {
    if (error) {
      setFormError("Something went wrong!");
    }
  }, [error]);

  const validTimesInTimezone = useMemo(() => {
    return availableTimes?.map((d) => toZonedTime(d, timezone)) ?? [];
  }, [availableTimes, timezone]);

  const timesForSelectedDate = useMemo(() => {
    return validTimesInTimezone.filter((t) => isSameDay(t, date));
  }, [validTimesInTimezone, date]);

  return (
    <Card className="w-full">
      <CardHeader className="center flex flex-row justify-between">
        <CardTitle className="py-2 text-2xl font-semibold lg:text-3xl">
          Edit Appointment
        </CardTitle>
      </CardHeader>
      <div>
        {isLoading ? (
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <HashLoader
                  color={theme.theme === "dark" ? "white" : "black"}
                />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          </CardContent>
        ) : appointment ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 text-lg">
                  <span>
                    <strong>Doctor:</strong> {appointment.doctors.users.name}
                  </span>
                  <span>
                    <strong>Procedure:</strong> {appointment.procedures.name}
                  </span>
                </div>
                <FormError message={formError} />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={"America/Santo_Domingo"}
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="America/Santo_Domingo">
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

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <Popover>
                        <FormItem className="flex-1">
                          <FormLabel>Date</FormLabel>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                                disabled={isPending}
                              >
                                {field.value
                                  ? formatDate(field.value)
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={
                                (d) =>
                                  !validTimesInTimezone.some((t) =>
                                    isSameDay(d, t),
                                  ) // Disable dates with no valid time
                              }
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
                      <FormItem className="flex-1">
                        <FormLabel>Start Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          disabled={!timesForSelectedDate.length || isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timesForSelectedDate.length ? (
                              timesForSelectedDate.map((t) => (
                                <SelectItem
                                  key={formatTimeToString(t)}
                                  value={formatTimeToString(t)}
                                >
                                  {formatTimeToString(t)}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-times" disabled>
                                No times available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="w-full"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push("/patient/appointments/")}
                >
                  Back
                </Button>
                <Button disabled={isPending} variant="default" type="submit">
                  {isPending ? "Processing..." : "Save"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        ) : null}
      </div>
    </Card>
  );
}
