import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SessionProvider } from "next-auth/react";
import { type BaseLayoutProps } from "@/types";
import { auth } from "@/server/auth";

export default async function BaseLayout({ children }: BaseLayoutProps) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
{
  /* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {children}
            </div> */
}

// {/* Contenedor del calendario */}
// <div className="max-h-[60vh] min-h-[50vh] flex-grow overflow-auto rounded-xl bg-muted/50 md:max-h-[70vh] md:min-h-[60vh]">
//   {/* Aquí va tu calendario */}
// </div>

// {/* Otros componentes debajo */}
// <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//   <div className="aspect-video rounded-xl bg-muted/50" />
//   <div className="aspect-video rounded-xl bg-muted/50" />
//   <div className="aspect-video rounded-xl bg-muted/50" />
// </div>
