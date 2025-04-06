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
  CalendarClock,
  DollarSign,
  Home,
  Send,
  CalendarDays,
  ClipboardPlus,
  User,
  CalendarRange,
  CalendarCheck,
  SquareChartGantt,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
          title: "Appointments",
          url: "/doctor/appointments",
          icon: CalendarRange,
        },
        {
          title: "Management",
          url: "/doctor/appointment-management",
          icon: SquareChartGantt,
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
          url: "/doctor/clinical-histories",
          icon: ClipboardPlus,
        },
      ],
    },
    {
      title: "Others",
      items: [
        {
          title: "Transactions",
          url: "/doctor/transactions",
          icon: DollarSign,
        },
        {
          title: "Chat",
          url: "/doctor/chat",
          icon: Send,
        },
      ],
    },
  ],
};

export function DoctorSidebar() {
  const user = useCurrentUser();
  const path = usePathname();

  data.user.name = user?.name ?? "";
  data.user.email = user?.email ?? "";
  data.user.image = user?.image ?? "";

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
                    <Link href={subitem.url}>
                      <SidebarMenuButton isActive={path === subitem.url}>
                        {subitem.icon && <subitem.icon />}
                        {subitem.title}
                      </SidebarMenuButton>
                    </Link>
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
