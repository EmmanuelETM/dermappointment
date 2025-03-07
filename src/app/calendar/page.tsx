"use client";

import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import "@schedule-x/theme-shadcn/dist/index.css";
import { useEffect, useState } from "react";

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [
      {
        id: "1",
        title: "Event 1",
        start: "2023-12-16",
        end: "2023-12-16",
      },
    ],
    plugins: [eventsService],
  });

  useEffect(() => {
    // get all events
    eventsService.getAll();
  }, [eventsService]);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar!} />
    </div>
  );
}

export default CalendarApp;

// import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
// import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar";
// import "@schedule-x/theme-shadcn/dist/index.css";

// function Page() {
//   const calendar = useCalendarApp({
//     views: [createViewWeek(), createViewMonthGrid()],
//     events: [
//       {
//         id: 1,
//         title: "My new event",
//         start: "2025-03-07 08:00",
//         end: "2025-03-07 10:00",
//       },
//     ],
//     selectedDate: "2025-03-07",
//   });

//   return (
//     <div className="flex flex-1 flex-col gap-4 p-4">
//       <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//         <div className="aspect-video rounded-xl bg-muted/50">
//           <ScheduleXCalendar calendarApp={calendar!} />
//         </div>
//         <div className="aspect-video rounded-xl bg-muted/50" />
//         <div className="aspect-video rounded-xl bg-muted/50" />
//       </div>
//       <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
//     </div>
//     // <div className="h-10 w-full">
//     //   <ScheduleXCalendar calendarApp={calendar!} />
//     // </div>
//   );
// }

// export default Page;

/* <div className="flex flex-1 flex-col gap-4 p-4">
<div className="grid auto-rows-min gap-4 md:grid-cols-3">
  <div className="aspect-video rounded-xl bg-muted/50" />
  <div className="aspect-video rounded-xl bg-muted/50" />
  <div className="aspect-video rounded-xl bg-muted/50" />
</div>
<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
</div> */
