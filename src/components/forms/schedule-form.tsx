"use client";

import { DAYS_OF_WEEK, type LOCATION } from "@/data/constants";
import { ScheduleFormSchema } from "@/schemas/schedule";
import { type z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Fragment, useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { timeToInt } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { formatTimezoneOffset } from "@/lib/formatters";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { saveSchedule } from "@/actions/doctor/schedule";
import { FormError } from "../auth/form-error";
import { FormSuccess } from "../auth/form-success";
import { useCurrentUser } from "@/hooks/user-current-user";
import { useRouter } from "next/navigation";

type Availability = {
  startTime: string;
  endTime: string;
  weekDay: (typeof DAYS_OF_WEEK)[number];
  location: (typeof LOCATION)[number];
};

type Schedule = {
  schedule?: {
    id: string;
    timezone: string;
    scheduleAvailability: Availability[];
  };
};

export function ScheduleForm({ schedule }: Schedule) {
  const user = useCurrentUser();
  const router = useRouter();

  if (!user || !user.id) {
    router.push("/login");
  }

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ScheduleFormSchema>>({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: {
      timezone:
        schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,

      availabilities: schedule?.scheduleAvailability
        ? [...schedule.scheduleAvailability]
            .sort((a, b) => timeToInt(a.startTime) - timeToInt(b.startTime))
            .map((availability) => ({
              ...availability,
              startTime: availability.startTime
                .split(":")
                .slice(0, 2)
                .join(":"),
              endTime: availability.endTime.split(":").slice(0, 2).join(":"),
              location: availability.location,
            }))
        : [],
    },
  });

  const timeZones = useMemo(() => {
    const relevantTimeZones = [
      "UTC",
      "America/New_York",
      "America/La_Paz",
      "America/Los_Angeles",
      "America/Chicago",
      "America/Denver",
      "America/Sao_Paulo",
      "Europe/London",
      "Europe/Berlin",
      "Europe/Madrid",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Kolkata",
      "Asia/Dubai",
    ];

    return relevantTimeZones.map((tz) => ({
      name: tz,
      offset: formatTimezoneOffset(tz) ?? "",
    }));
  }, []);

  const {
    append: addAvailability,
    remove: removeAvailability,
    fields: availabilityFields,
  } = useFieldArray({ name: "availabilities", control: form.control });

  const groupedAvailabilityFields = Object.groupBy(
    availabilityFields.map((field, index) => ({ ...field, index })),
    (availability) => availability.weekDay,
  );

  const onSubmit = (values: z.infer<typeof ScheduleFormSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await saveSchedule(values);

        if (response?.success) {
          setSuccess(response?.success);
        } else if (response?.error) {
          setError(response?.error);
        }
      } catch {
        setError("Something went wrong!");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <div className="w-full flex-1 space-y-4">
            <FormError message={error} />
            <FormSuccess message={success} />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
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
          </div>
        </div>

        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-6">
          {DAYS_OF_WEEK.map((weekDay) => (
            <Fragment key={weekDay}>
              <div className="text-sm font-semibold capitalize">
                {weekDay.substring(0, 3)}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  className="size-6 p-1"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    addAvailability({
                      weekDay,
                      startTime: "9:00",
                      endTime: "17:00",
                      location: "La Vega",
                    });
                  }}
                >
                  <Plus className="size-full" />
                </Button>
                {groupedAvailabilityFields[weekDay]?.map(
                  (field, labelIndex) => (
                    <div className="flex flex-col gap-1" key={field.id}>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="w-24"
                                  disabled={isPending}
                                  aria-label={`${weekDay} Start Time ${
                                    labelIndex + 1
                                  }`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        -
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="w-24"
                                  disabled={isPending}
                                  aria-label={`${weekDay} End Time ${
                                    labelIndex + 1
                                  }`}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={isPending}
                                >
                                  <FormItem>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="La Vega">
                                        <p className="mx-2">La Vega</p>
                                      </SelectItem>
                                      <SelectItem value="Puerto Plata">
                                        <p className="mx-2">Puerto Plata</p>
                                      </SelectItem>
                                    </SelectContent>
                                    <FormMessage />
                                  </FormItem>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          className="size-6 p-1"
                          disabled={isPending}
                          variant="destructiveGhost"
                          onClick={() => removeAvailability(field.index)}
                        >
                          <X />
                        </Button>
                      </div>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index,
                          )?.root?.message
                        }
                      </FormMessage>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index,
                          )?.startTime?.message
                        }
                      </FormMessage>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index,
                          )?.endTime?.message
                        }
                      </FormMessage>
                    </div>
                  ),
                )}
              </div>
            </Fragment>
          ))}
        </div>

        <div className="flex justify-start">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
