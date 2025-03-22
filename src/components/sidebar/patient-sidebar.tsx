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
  CalendarPlus,
  DollarSign,
  Hospital,
  Home,
  Send,
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
          url: "/patient/home",
          icon: Home,
        },
      ],
    },
    {
      title: "Search",
      items: [
        {
          title: "Doctors",
          url: "/patient/search-doctors",
          icon: Hospital,
        },
      ],
    },
    {
      title: "Appointments",
      items: [
        {
          title: "New Appointment",
          url: "/patient/new-appointment",
          icon: CalendarPlus,
        },
        {
          title: "My Appointments",
          url: "/patient/my-appointments",
          icon: CalendarCheck,
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

export function PatientSidebar({
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
