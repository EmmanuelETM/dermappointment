"use client";

import { DAYS_OF_WEEK } from "@/data/constants";
import { ScheduleFormSchema } from "@/schemas/schedule";
import { type z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Fragment, useState } from "react";
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

type Availability = {
  start: string;
  end: string;
  weekDay: (typeof DAYS_OF_WEEK)[number];
};

export function ScheduleForm({
  schedule,
}: {
  schedule?: {
    id: string;
    timezone: string;
    scheduleAvailability: Availability[];
  };
}) {
  const [successMessage, setSuccessMessage] = useState<string>();

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

  const {
    append: addAvailability,
    remove: removeAvailability,
    fields: availabilityFields,
  } = useFieldArray({ name: "availabilities", control: form.control });

  const groupedAvailabilityFields = Object.groupBy(
    availabilityFields.map((field, index) => ({ ...field, index })),
    (availability) => availability.weekDay,
  );

  const onSubmit = async (values: z.infer<typeof ScheduleFormSchema>) => {
    console.log("submiting");

    console.log(values);
    // const data = await saveSchedule(values);
    // if (data?.error) {
    //   form.setError("root", {
    //     message: "There was an error saving you schedule",
    //   });
    // } else {
    //   setSuccessMessage("Schedule saved!");
    // }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-4 grid gap-6">
          <div className="grid gap-2 space-y-2">
            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
            {successMessage && (
              <div className="text-sm text-green-500">{successMessage}</div>
            )}
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Intl.supportedValuesOf("timeZone").map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                          {` (${formatTimezoneOffset(timezone)})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    disabled={form.formState.isSubmitting}
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
                                    disabled={form.formState.isSubmitting}
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
                                    disabled={form.formState.isSubmitting}
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
                            disabled={form.formState.isSubmitting}
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

          <div className="flex justify-end gap-2">
            <Button disabled={form.formState.isSubmitting} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
