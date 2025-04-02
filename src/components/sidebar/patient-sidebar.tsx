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
  DollarSign,
  Hospital,
  Home,
  Send,
  CalendarRange,
  CalendarDays,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    image: "",
  },
  sidebar: [
    {
      title: "Home",
      items: [
        {
          title: "Home",
          url: "/patient/home",
          icon: Home,
        },
        {
          title: "Calendar",
          url: "/patient/calendar",
          icon: CalendarDays,
        },
      ],
    },
    {
      title: "Actions",
      items: [
        {
          title: "Doctors",
          url: "/patient/doctors",
          icon: Hospital,
        },
        {
          title: "Appointments",
          url: "/patient/appointments",
          icon: CalendarRange,
        },
      ],
    },
    {
      title: "Others",
      items: [
        {
          title: "Transactions",
          url: "/patient/transactions",
          icon: DollarSign,
        },
        {
          title: "Chat",
          url: "/patient/chat",
          icon: Send,
        },
      ],
    },
  ],
};

export function PatientSidebar() {
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
