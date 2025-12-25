import {
  Calendar,
  Building2,
  BookOpen,
  DoorOpen,
  LayoutDashboard,
  Sparkles,
  Tag,
  GraduationCap,
  Settings,
} from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"

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
} from "@/components/ui/sidebar"

const navigation = [
  {
    title: "Main",
    items: [
      { title: "Home", href: "/", icon: LayoutDashboard },
      { title: "Timetable", href: "/schedule", icon: Calendar },
    ],
  },
  {
    title: "Manage",
    items: [
      { title: "Courses", href: "/courses", icon: BookOpen },
      { title: "Rooms", href: "/rooms", icon: DoorOpen },
      { title: "Buildings", href: "/buildings", icon: Building2 },
      { title: "Room Types", href: "/room-types", icon: Tag },
    ],
  },
  {
    title: "Create",
    items: [
      { title: "New Schedule", href: "/generate", icon: Sparkles },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Course Scheduler">
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
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
  )
}
