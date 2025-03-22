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

import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  DollarSign,
  Hospital,
  Home,
  Send,
  CalendarDays,
  ClipboardPlus,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    image: "https://robohash.org/1",
  },
  sidebar: [
    {
      title: "Home",
      items: [
        {
          title: "Home",
          url: "/doctor/home",
          icon: Home,
        },
      ],
    },
    {
      title: "Schedule",
      items: [
        {
          title: "Schedule",
          url: "/doctor/schedule",
          icon: CalendarClock,
        },
        {
          title: "Calendar",
          url: "/doctor/calendar",
          icon: CalendarDays,
        },
      ],
    },
    {
      title: "Appointments",
      items: [
        {
          title: "New Appointment",
          url: "/doctor/new-appointment",
          icon: CalendarPlus,
        },
        {
          title: "My Appointments",
          url: "/doctor/my-appointments",
          icon: CalendarCheck,
        },
      ],
    },
    {
      title: "Patients",
      items: [
        {
          title: "Patients",
          url: "/doctor/patients",
          icon: User,
        },
        {
          title: "Clinical Histories",
          url: "/doctor/histories",
          icon: ClipboardPlus,
        },
      ],
    },
    {
      title: "Others",
      items: [
        {
          title: "Chat",
          url: "/doctor/chat",
          icon: Send,
        },
      ],
    },
  ],
};

export function DoctorSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = useCurrentUser();
  data.user.name = user?.name ?? "";
  data.user.email = user?.email ?? "";
  data.user.image = user?.image ?? "";
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        {data.sidebar.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subitem) => (
                  <SidebarMenuItem key={subitem.title}>
                    <SidebarMenuButton onClick={() => router.push(subitem.url)}>
                      {subitem.icon && <subitem.icon />}
                      {subitem.title}
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
