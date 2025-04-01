"use client";

import { DAYS_OF_WEEK } from "@/data/constants";
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

type Availability = {
  start: string;
  end: string;
  weekDay: (typeof DAYS_OF_WEEK)[number];
};

type Schedule = {
  schedule?: {
    id: string;
    timezone: string;
    scheduleAvailability: Availability[];
  };
};

export function ScheduleForm({ schedule }: Schedule) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ScheduleFormSchema>>({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: {
      timezone:
        schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      availabilities: schedule?.scheduleAvailability
        ? [...schedule.scheduleAvailability].sort(
            (a, b) => timeToInt(a.start) - timeToInt(b.start),
          )
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
                      start: "9:00",
                      end: "17:00",
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
                          name={`availabilities.${field.index}.start`}
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
                          name={`availabilities.${field.index}.end`}
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
                          )?.start?.message
                        }
                      </FormMessage>
                      <FormMessage>
                        {
                          form.formState.errors.availabilities?.at?.(
                            field.index,
                          )?.end?.message
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
