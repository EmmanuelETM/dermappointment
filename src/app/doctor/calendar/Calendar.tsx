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
  const monthView = createViewMonthGrid();

  const calendar = useNextCalendarApp({
    defaultView: monthView.name,
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
      people: appointment.patient ? [appointment.patient] : undefined,
      description: appointment.description ?? "",
      calendarId: `${appointment.location} - ${appointment.status}`, // ← Aquí combinamos
    })),
    plugins: [
      eventsService,
      createEventModalPlugin(),
      createCurrentTimePlugin(),
      createScrollControllerPlugin(),
    ],
    calendars: {
      "Puerto Plata - Confirmed": {
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
      "Puerto Plata - Pending": {
        colorName: "oceanside-pending",
        lightColors: {
          main: "#5e5345", // mostaza dorado claro
          container: "#fff4d6", // marfil cálido
          onContainer: "#5e4b1f", // marrón mostaza profundo
        },
        darkColors: {
          main: "#d4a738", // dorado suave
          container: "#4a3a14", // marrón mostaza oscuro
          onContainer: "#f9e6b6", // amarillo claro para contrastar
        },
      },
      "Puerto Plata - Completed": {
        colorName: "oceanside-completed",
        lightColors: {
          main: "#9ca3af", // gris similar a main original
          container: "#e5e7eb", // gris claro (antes #bde6fc)
          onContainer: "#4b5563", // gris oscuro (antes #1a3f61)
        },
        darkColors: {
          main: "#6b7280", // gris medio
          container: "#374151", // gris oscuro
          onContainer: "#d1d5db", // gris claro
        },
      },
      "La Vega - Confirmed": {
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
      "La Vega - Pending": {
        colorName: "elegant-pending",
        lightColors: {
          main: "#5e5345", // mostaza dorado claro
          container: "#fff4d6", // marfil cálido
          onContainer: "#5e4b1f", // marrón mostaza profundo
        },
        darkColors: {
          main: "#d4a738", // dorado suave
          container: "#4a3a14", // marrón mostaza oscuro
          onContainer: "#f9e6b6", // amarillo claro para contrastar
        },
      },
      "La Vega - Completed": {
        colorName: "elegant-completed",
        lightColors: {
          main: "#9ca3af",
          container: "#e5e7eb",
          onContainer: "#4b5563",
        },
        darkColors: {
          main: "#6b7280",
          container: "#374151",
          onContainer: "#d1d5db",
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
