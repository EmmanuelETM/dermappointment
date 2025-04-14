import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import { getActiveAppointmentsData } from "@/data/appointments";
import { Calendar } from "./Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatientsCount } from "@/data/doctorDashboard";
import {
  endOfMonth,
  isToday,
  startOfMonth,
  isAfter,
  startOfToday,
} from "date-fns";
import { Button } from "@/components/ui/button";

import { Eye } from "lucide-react";
import Link from "next/link";

export default async function DoctorHomePage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  const appointments = await getActiveAppointmentsData(
    "doctorId",
    user.doctorId,
  );

  const upcomingThisMonth = appointments.filter((appt) => {
    const start = new Date(appt.startTime);
    return start >= startOfMonth(new Date()) && start <= endOfMonth(new Date());
  }).length;

  const forToday = appointments.filter((appt) => {
    const start = new Date(appt.startTime);
    return isToday(start) && appt.status !== "Completed";
  }).length;

  const pending = appointments.filter((appt) => {
    const start = new Date(appt.startTime);
    return isAfter(start, startOfToday()) && appt.status === "Pending";
  }).length;

  const count = await getPatientsCount();

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_auto_auto_auto] gap-6 p-4 md:grid-cols-2 md:grid-rows-[auto_auto_auto_auto] xl:grid-cols-4 xl:grid-rows-[auto_auto_auto_auto]">
      {/* Cards */}
      <Card className="col-span-1 xl:col-span-1">
        <CardHeader>
          <CardTitle>Total Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{count.total}</div>
          <p className="text-sm text-muted-foreground">
            +{count.thisMonth} this month
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-1 xl:col-span-1">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{upcomingThisMonth}</div>
          <p className="text-sm text-muted-foreground">{forToday} today</p>
        </CardContent>
      </Card>

      <Card className="col-span-1 xl:col-span-1">
        <CardHeader>
          <CardTitle>Pending Confirmations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{pending}</div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {pending > 0 ? "Review needed" : "Everything up to date"}
            </p>

            <Link hidden={pending <= 0} href="/doctor/appointment-management">
              <Button>
                <Eye size={32} />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 xl:col-span-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">This is for chart</div>
          <p className="text-sm text-muted-foreground">chart goes here</p>
        </CardContent>
      </Card>

      {/* Calendar section */}
      <div className="col-span-1 md:col-span-2 xl:col-span-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="w-full overflow-x-auto overflow-y-auto">
            <div className="w-full min-w-[600px] rounded-xl border-2">
              <Calendar appointments={appointments} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
