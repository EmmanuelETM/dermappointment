"use server";

import { getAppointmentsData } from "@/data/appointments";
import { endOfDay, startOfDay } from "date-fns";

type AppointmentTimesProp = {
  doctorId: string;
  date: {
    start: Date;
    end: Date;
  };
};

export async function getAppointmentTimes({
  doctorId,
  date,
}: AppointmentTimesProp) {
  const appointments = await getAppointmentsData(
    "doctorId",
    doctorId,
    "Confirmed",
  );

  return appointments
    .map((appointment) => {
      if (!appointment.startTime || !appointment.endTime) return null;

      // Verifica si es un evento de día completo
      const isFullDayEvent =
        appointment.startTime.getHours() === 0 &&
        appointment.startTime.getMinutes() === 0 &&
        appointment.endTime.getHours() === 23 &&
        appointment.endTime.getMinutes() === 59;

      return {
        start: isFullDayEvent
          ? startOfDay(appointment.startTime)
          : new Date(appointment.startTime),
        end: isFullDayEvent
          ? endOfDay(appointment.endTime)
          : new Date(appointment.endTime),
      };
    })
    .filter((item): item is { start: Date; end: Date } => item !== null);
}
