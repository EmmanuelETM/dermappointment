"use server";

type CalendarEventTimeProp = {
  userId: string;
  date: {
    start: Date;
    end: Date;
  };
};

export async function getCalendarEventTimes({
  userId,
  date,
}: CalendarEventTimeProp) {
  return;
}
