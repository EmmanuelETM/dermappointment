import { DAYS_OF_WEEK } from "@/data/constants";
import { timeToInt } from "@/lib/utils";
import { z } from "zod";

export const ScheduleFormSchema = z.object({
  timezone: z.string().min(1, "Required"),
  availabilities: z
    .array(
      z.object({
        weekDay: z.enum(DAYS_OF_WEEK),
        start: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM",
          ),
        end: z
          .string()
          .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM",
          ),
      }),
    )
    .superRefine((availabilities, ctx) => {
      availabilities.forEach((availability, index) => {
        const startTime = timeToInt(availability.start);
        const endTime = timeToInt(availability.end);

        if (startTime >= endTime) {
          ctx.addIssue({
            code: "custom",
            message: "End time must be after start time",
            path: [index, "end"], // Se asigna el error al campo 'end'
          });
        }

        const hasOverlap = availabilities.some(
          (a, i) =>
            i !== index &&
            a.weekDay === availability.weekDay &&
            timeToInt(a.start) < endTime &&
            timeToInt(a.end) > startTime,
        );

        if (hasOverlap) {
          ctx.addIssue({
            code: "custom",
            message: "Availability overlaps with another",
            path: [index, "start"], // Se asigna el error al campo 'start'
          });
        }
      });
    }),
});
