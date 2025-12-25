import { HeadContent, Outlet, Scripts, createRootRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Search,
  LayoutDashboard,
  Calendar,
  BookOpen,
  DoorOpen,
  Building2,
  Tag,
  Sparkles,
  Settings,
  LogOut,
  User,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Course Scheduler' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-hidden" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('course-scheduler-theme') || 'system';
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (theme === 'system' && systemDark);
                document.documentElement.classList.add(isDark ? 'dark' : 'light');
              })();
            `,
          }}
        />
      </head>
      <body className="h-full overflow-hidden">
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/schedule': 'Timetable',
  '/courses': 'Courses',
  '/rooms': 'Rooms',
  '/buildings': 'Buildings',
  '/room-types': 'Room Types',
  '/generate': 'Create Schedule',
  '/settings': 'Settings',
}

const navigationItems = [
  { title: 'Home', href: '/', icon: LayoutDashboard },
  { title: 'Timetable', href: '/schedule', icon: Calendar },
  { title: 'Courses', href: '/courses', icon: BookOpen },
  { title: 'Rooms', href: '/rooms', icon: DoorOpen },
  { title: 'Buildings', href: '/buildings', icon: Building2 },
  { title: 'Room Types', href: '/room-types', icon: Tag },
  { title: 'New Schedule', href: '/generate', icon: Sparkles },
  { title: 'Settings', href: '/settings', icon: Settings },
]

function RootComponent() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentTitle = routeTitles[location.pathname] || 'Dashboard'
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleNavigate = (href: string) => {
    navigate({ to: href })
    setCommandOpen(false)
  }

  return (
    <SidebarProvider className="h-full min-h-0!">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-full">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {location.pathname !== '/' && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2 px-4">
            <Button
              variant="outline"
              className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="size-4 xl:mr-2" />
              <span className="hidden xl:inline-flex">Search...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-9 rounded-full">
                  <Avatar className="size-9">
                    <AvatarImage src="/avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@university.edu
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/settings' })} className="cursor-pointer">
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/settings' })} className="cursor-pointer">
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-auto p-3 md:p-4 lg:p-6">
          <Outlet />
        </div>
      </SidebarInset>

      {/* Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Where would you like to go?" />
        <CommandList>
          <CommandEmpty>No results found. Try a different search.</CommandEmpty>
          <CommandGroup heading="Pages">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => handleNavigate(item.href)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 size-4" />
                <span>{item.title}</span>
                {location.pathname === item.href && (
                  <span className="ml-auto text-xs text-muted-foreground">Current</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleNavigate('/generate')} className="cursor-pointer">
              <Sparkles className="mr-2 size-4" />
              Create a new schedule
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/courses')} className="cursor-pointer">
              <BookOpen className="mr-2 size-4" />
              Add a course
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/rooms')} className="cursor-pointer">
              <DoorOpen className="mr-2 size-4" />
              Add a room
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Toaster richColors position="bottom-right" />
    </SidebarProvider>
  )
}
