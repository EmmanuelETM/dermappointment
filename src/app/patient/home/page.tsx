import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import { getActiveAppointmentsData } from "@/data/appointments";
import { Calendar } from "./Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/login");
  }
  const appointments = await getActiveAppointmentsData("userId", user.id);

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_auto_auto_auto] gap-6 p-4 md:grid-cols-2 md:grid-rows-[auto_auto_auto_auto] xl:grid-cols-4 xl:grid-rows-[auto_auto_auto_auto]">
      {/* Cards */}
      <Card className="col-span-1 xl:col-span-1">
        <CardHeader>
          <CardTitle>Total Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">5</div>
          <p className="text-sm text-muted-foreground"></p>
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
