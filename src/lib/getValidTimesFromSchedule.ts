"use server";

import { getAppointmentTimes } from "@/actions/appointments/getAppointment";
import { type LOCATION, type DAYS_OF_WEEK } from "@/data/constants";
import { type Procedure } from "@/schemas/admin/procedures";
import { db } from "@/server/db";
import { schedule, scheduleAvailability } from "@/server/db/schema";

import {
  addMinutes,
  areIntervalsOverlapping,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
  setHours,
  setMinutes,
} from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { and, eq } from "drizzle-orm";

export async function getValidTimesFromSchedule(
  timesInOrder: Date[],
  procedure: Procedure,
  doctorId: string,
  location: (typeof LOCATION)[number],
) {
  const start = timesInOrder[0];
  const end = timesInOrder[timesInOrder.length - 1];

  console.log("start", start, "end", end);

  if (start == null || end == null) return [];

  const doctorSchedule = await db.query.schedule.findFirst({
    where: and(eq(schedule.doctorId, doctorId)),
    with: {
      scheduleAvailability: {
        where: eq(scheduleAvailability.location, location),
      },
    },
  });

  if (!doctorSchedule) return [];

  const groupedAvailabilites = Object.groupBy(
    doctorSchedule.scheduleAvailability,
    (a) => a.weekDay,
  );

  const date = { start, end };

  const appointmentTimes = await getAppointmentTimes({ doctorId, date });

  return timesInOrder.filter((intervalDate) => {
    const availabilities = getAvailabilities(
      groupedAvailabilites,
      intervalDate,
      doctorSchedule.timezone,
    );

    const appointmentInterval = {
      start: intervalDate,
      end: addMinutes(intervalDate, procedure.duration),
    };

    return (
      appointmentTimes.every((appointmentTime) => {
        return !areIntervalsOverlapping(appointmentTime, appointmentInterval);
      }) &&
      availabilities.some((availability) => {
        return (
          isWithinInterval(appointmentInterval.start, availability) &&
          isWithinInterval(appointmentInterval.end, availability)
        );
      })
    );
  });
}

function getAvailabilities(
  groupedAvailabilites: Partial<
    Record<
      (typeof DAYS_OF_WEEK)[number],
      (typeof scheduleAvailability.$inferSelect)[]
    >
  >,
  date: Date,
  timezone: string,
) {
  let availabilities: (typeof scheduleAvailability.$inferSelect)[] | undefined;

  if (isMonday(date)) {
    availabilities = groupedAvailabilites.monday;
  }

  if (isTuesday(date)) {
    availabilities = groupedAvailabilites.tuesday;
  }

  if (isWednesday(date)) {
    availabilities = groupedAvailabilites.wednesday;
  }

  if (isThursday(date)) {
    availabilities = groupedAvailabilites.thursday;
  }

  if (isFriday(date)) {
    availabilities = groupedAvailabilites.friday;
  }

  if (isSaturday(date)) {
    availabilities = groupedAvailabilites.saturday;
  }

  if (isSunday(date)) {
    availabilities = groupedAvailabilites.sunday;
  }

  if (availabilities == null) return [];

  return availabilities.map(({ startTime, endTime }) => {
    const start = fromZonedTime(
      setMinutes(
        setHours(date, parseInt(startTime.split(":")[0]!)),
        parseInt(startTime.split(":")[1]!),
      ),
      timezone,
    );

    const end = fromZonedTime(
      setMinutes(
        setHours(date, parseInt(endTime.split(":")[0]!)),
        parseInt(endTime.split(":")[1]!),
      ),
      timezone,
    );

    return { start, end };
  });
}
