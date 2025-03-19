"use client";
import * as React from "react";
import { useCurrentUser } from "@/hooks/user-current-user";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    image: "https://robohash.org/1",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      items: [
        {
          title: "Appointments",
          url: "/patient/dashboard",
        },
        {
          title: "Doctors",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
      ],
    },
  ],
};

export function PatientSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = useCurrentUser();
  data.user.name = user?.name ?? "";
  data.user.email = user?.email ?? "";
  data.user.image = user?.image ?? "";

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
