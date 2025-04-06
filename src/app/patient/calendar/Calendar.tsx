"use client";

import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";

import "@schedule-x/theme-default/dist/index.css";
import { type Appointment } from "@/schemas/appointment";
import { format } from "date-fns-tz/format";

export function Calendar({ appointments }: { appointments: Appointment[] }) {
  const eventsService = createEventsServicePlugin();

  console.log(appointments);

  console.log(
    appointments.map((appointment) => ({
      id: appointment.id,
      title: appointment.procedure ?? "Appointment",
      start: format(appointment.startTime, "yyyy-MM-dd HH:mm", {
        timeZone: appointment.timezone!,
      }),
      end: format(appointment.endTime, "yyyy-MM-dd HH:mm", {
        timeZone: appointment.timezone!,
      }),
      description: appointment.description ?? "",
    })),
  );

  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    dayBoundaries: {
      start: "07:00",
      end: "19:00",
    },
    events: appointments.map((appointment) => ({
      id: appointment.id,
      title: appointment.procedure ?? "Appointment",
      start: format(appointment.startTime, "yyyy-MM-dd HH:mm", {
        timeZone: appointment.timezone!,
      }),
      end: format(appointment.endTime, "yyyy-MM-dd HH:mm", {
        timeZone: appointment.timezone!,
      }),
      location: appointment.location,
      people: appointment.doctor ? [appointment.doctor] : undefined,
      description: appointment.description ?? "",
      calendarId: appointment.location,
    })),
    plugins: [
      eventsService,
      createEventModalPlugin(),
      createCurrentTimePlugin(),
      createScrollControllerPlugin(),
    ],
    calendars: {
      "Puerto Plata": {
        colorName: "oceanside",
        lightColors: {
          main: "#5db8f7",
          container: "#bde6fc",
          onContainer: "#1a3f61",
        },
        darkColors: {
          main: "#3d74a3",
          onContainer: "#d1e7ff",
          container: "#1b3c5f",
        },
      },
      "La Vega": {
        colorName: "elegant",
        lightColors: {
          main: "#6c8e4f",
          container: "#e1f0d3",
          onContainer: "#2f3a21",
        },
        darkColors: {
          main: "#4f7041",
          onContainer: "#c5d8b0",
          container: "#2b3d1f",
        },
      },
    },
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}
