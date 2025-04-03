import { DAYS_OF_WEEK, LOCATION } from "@/data/constants";
import { timeToInt } from "@/lib/utils";
import { z } from "zod";

export const ScheduleFormSchema = z.object({
  timezone: z.string().min(1, "Required"),
  availabilities: z
    .array(
      z.object({
        weekDay: z.enum(DAYS_OF_WEEK),
        location: z.enum(LOCATION),
        startTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM",
          ),
        endTime: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM",
          ),
      }),
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((availability, index) => {
        const startTime = timeToInt(availability.startTime);
        const endTime = timeToInt(availability.endTime);

        if (startTime >= endTime) {
          ctx.addIssue({
            code: "custom",
            message: "End time must be after start time",
            path: [index, "endTime"], // Se asigna el error al campo 'end'
          });
        }

        const hasOverlap = availabilities.some(
          (a, i) =>
            i !== index &&
            a.weekDay === availability.weekDay &&
            timeToInt(a.startTime) < endTime &&
            timeToInt(a.endTime) > startTime,
        );

        if (hasOverlap) {
          ctx.addIssue({
            code: "custom",
            message: "Availability overlaps with another",
            path: [index, "startTime"], // Se asigna el error al campo 'start'
          });
        }
      });
    }),
});
