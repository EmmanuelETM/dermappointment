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

import "@schedule-x/theme-default/dist/index.css";
import { useState } from "react";

export function Calendar() {
  const eventsService = useState(() => createEventsServicePlugin())[0];

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
    events: [
      {
        id: "1",
        title: "Event 1",
        start: "2025-04-02 09:00",
        end: "2025-04-02 10:00",
        description: "asdfasdfasdf",
      },
    ],
    plugins: [
      eventsService,
      createEventModalPlugin(),
      createCurrentTimePlugin(),
    ],
    callbacks: {
      onRender: () => {
        // get all events
        eventsService.getAll();
      },
    },
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}
