import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/server/auth";
import { DoctorSidebar } from "@/components/sidebar/doctor-sidebar";
import { CalendarRange } from "lucide-react";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <DoctorSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-row items-center gap-2">
              <CalendarRange className="size-6" />
              <p className="sr-only text-xl font-extrabold md:not-sr-only">
                DermAppointment
              </p>
            </div>
          </header>
          <div className="m-4 flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}

{
  /* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
<div className="aspect-video rounded-xl bg-muted/50" />
<div className="aspect-video rounded-xl bg-muted/50" />
<div className="aspect-video rounded-xl bg-muted/50" />
</div>
<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */
}
