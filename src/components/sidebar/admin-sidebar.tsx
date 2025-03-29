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
  Send,
  Gauge,
  User,
  Calendar,
  Hospital,
  Sparkle,
  Activity,
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
      title: "Manteinance",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: Gauge,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: User,
        },
        {
          title: "Doctors",
          url: "/admin/doctors",
          icon: Hospital,
        },
        {
          title: "Specialties",
          url: "/admin/specialties",
          icon: Sparkle,
        },
        {
          title: "Procedures",
          url: "/admin/procedures",
          icon: Activity,
        },
        {
          title: "Appointments",
          url: "/admin/new-appointment",
          icon: Calendar,
        },
        {
          title: "Payments",
          url: "/admin/payments",
          icon: DollarSign,
        },
        {
          title: "Chat",
          url: "/admin/chat",
          icon: Send,
        },
      ],
    },
  ],
};

export function AdminSidebar() {
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
