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

import { DollarSign, Send, Gauge, User, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

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

export function AdminSidebar({
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
