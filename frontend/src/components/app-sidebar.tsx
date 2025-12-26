import
  {
    Calendar,
    Building2,
    BookOpen,
    DoorOpen,
    LayoutDashboard,
    Sparkles,
    Tag,
    Settings,
  } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

import
  {
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
import { LogoIcon } from "@/components/logo";

const navigation = [
  {
    title: "Main",
    items: [
      { title: "Home", href: "/app", icon: LayoutDashboard },
      { title: "Timetable", href: "/app/schedule", icon: Calendar },
    ],
  },
  {
    title: "Manage",
    items: [
      { title: "Courses", href: "/app/courses", icon: BookOpen },
      { title: "Rooms", href: "/app/rooms", icon: DoorOpen },
      { title: "Buildings", href: "/app/buildings", icon: Building2 },
      { title: "Room Types", href: "/app/room-types", icon: Tag },
    ],
  },
  {
    title: "Create",
    items: [
      { title: "New Schedule", href: "/app/generate", icon: Sparkles },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Settings", href: "/app/settings", icon: Settings },
    ],
  },
];

export function AppSidebar ()
{
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Course Scheduler">
              <Link to="/app">
                <LogoIcon size="md" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Course Scheduler</span>
                  <span className="truncate text-xs text-muted-foreground">University</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
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
