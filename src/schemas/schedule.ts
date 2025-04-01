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
        const overlaps = availabilities.some((a, i) => {
          return (
            i !== index &&
            a.weekDay === availability.weekDay &&
            timeToInt(a.start) < timeToInt(availability.end) &&
            timeToInt(a.end) > timeToInt(availability.start)
          );
        });

        if (overlaps) {
          ctx.addIssue({
            code: "custom",
            message: "Availability overlaps with another",
            path: [index],
          });
        }

        if (timeToInt(availability.start) >= timeToInt(availability.end)) {
          ctx.addIssue({
            code: "custom",
            message: "End time must be after start time",
            path: [index],
          });
        }
      });
    }),
});
