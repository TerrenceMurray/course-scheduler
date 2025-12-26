import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  BookOpen,
  DoorOpen,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Clock,
  Building2,
  Plus,
  X,
  Lightbulb,
  ChevronRight,
  AlertCircle,
  Zap,
  Target,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CountUp } from '@/components/count-up'
import { Progress } from '@/components/ui/progress'

export const Route = createFileRoute('/app/')({
  component: Dashboard,
})

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function Dashboard() {
  const [showTip, setShowTip] = useState(true)

  const activityItems = [
    { id: 1, action: 'Schedule generated', detail: 'Fall 2024 Schedule', time: '2h ago', icon: Sparkles, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { id: 2, action: 'Course added', detail: 'CS401 Advanced Topics', time: '5h ago', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 3, action: 'Room updated', detail: 'Lab A capacity changed', time: '1d ago', icon: DoorOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 4, action: 'Building added', detail: 'Engineering West', time: '2d ago', icon: Building2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ]

  const stats = [
    {
      title: 'Courses',
      value: '24',
      icon: BookOpen,
      change: '+2 this term',
      trend: 'up',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      href: '/app/courses',
    },
    {
      title: 'Rooms',
      value: '18',
      icon: DoorOpen,
      change: '3 buildings',
      trend: 'neutral',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      href: '/app/rooms',
    },
    {
      title: 'Scheduled',
      value: '142',
      icon: Calendar,
      change: '98% placed',
      trend: 'up',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      href: '/app/schedule',
    },
    {
      title: 'Health',
      value: '98%',
      icon: CheckCircle2,
      change: 'No conflicts',
      trend: 'up',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      href: '/app/schedule',
    },
  ]

  const recentSchedules = [
    { id: 1, name: 'Fall 2024 Schedule', sessions: 142, progress: 98, status: 'active' },
    { id: 2, name: 'Summer 2024 Schedule', sessions: 48, progress: 100, status: 'archived' },
    { id: 3, name: 'Spring 2024 Schedule', sessions: 138, progress: 100, status: 'archived' },
  ]

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const hours = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM']

  const previewSessions = [
    { day: 'Mon', hour: '9AM', color: 'bg-blue-500', name: 'CS101' },
    { day: 'Mon', hour: '2PM', color: 'bg-violet-500', name: 'CS201' },
    { day: 'Tue', hour: '10AM', color: 'bg-emerald-500', name: 'MATH101' },
    { day: 'Wed', hour: '9AM', color: 'bg-blue-500', name: 'CS101' },
    { day: 'Wed', hour: '1PM', color: 'bg-amber-500', name: 'PHYS101' },
    { day: 'Thu', hour: '11AM', color: 'bg-violet-500', name: 'CS201' },
    { day: 'Fri', hour: '9AM', color: 'bg-emerald-500', name: 'MATH101' },
    { day: 'Fri', hour: '3PM', color: 'bg-blue-500', name: 'CS301' },
  ]

  const hasSession = (day: string, hour: string) => {
    return previewSessions.find(s => s.day === day && s.hour === hour)
  }

  const insights = [
    { icon: Target, label: 'Peak usage', value: 'Tue 10AM', color: 'text-blue-500' },
    { icon: Zap, label: 'Utilization', value: '87%', color: 'text-emerald-500' },
    { icon: Clock, label: 'Teaching hours', value: '213h', color: 'text-violet-500' },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getGreeting()}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your scheduling system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/app/courses">
              <Plus className="mr-2 size-4" />
              Add Course
            </Link>
          </Button>
          <Button asChild>
            <Link to="/app/generate">
              <Sparkles className="mr-2 size-4" />
              Generate Schedule
            </Link>
          </Button>
        </div>
      </div>

      {/* Tip Banner */}
      {showTip && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-violet-500/5 border border-primary/10">
          <div className="rounded-full bg-primary/10 p-2">
            <Lightbulb className="size-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Quick Tip</p>
            <p className="text-sm text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono mx-0.5">⌘K</kbd> to quickly navigate between pages.
            </p>
          </div>
          <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={() => setShowTip(false)}>
            <X className="size-4" />
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.iconBg} transition-transform group-hover:scale-110`}>
                  <stat.icon className={`size-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  <CountUp value={stat.value} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.trend === 'up' && <TrendingUp className="size-3 text-emerald-500" />}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Weekly Preview - Larger */}
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>This Week</CardTitle>
              <CardDescription>Your current timetable at a glance</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link to="/app/schedule">
                Full schedule
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {/* Insights Row */}
            <div className="flex gap-4 mb-4 pb-4 border-b">
              {insights.map((insight) => (
                <div key={insight.label} className="flex items-center gap-2">
                  <insight.icon className={`size-4 ${insight.color}`} />
                  <span className="text-xs text-muted-foreground">{insight.label}:</span>
                  <span className="text-sm font-medium">{insight.value}</span>
                </div>
              ))}
            </div>
            {/* Day Headers */}
            <div className="grid grid-cols-6 gap-1.5 mb-2">
              <div />
              {days.map((day) => (
                <div key={day} className="text-xs font-medium text-center text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>
            {/* Time Grid */}
            <div className="space-y-1.5">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-6 gap-1.5">
                  <div className="text-xs text-muted-foreground text-right pr-2 flex items-center justify-end">
                    {hour}
                  </div>
                  {days.map((day) => {
                    const session = hasSession(day, hour)
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`h-6 rounded-md transition-all ${
                          session
                            ? `${session.color} cursor-pointer hover:opacity-80 hover:scale-105`
                            : 'bg-muted/40 hover:bg-muted/60'
                        }`}
                        title={session ? `${session.name} - ${day} ${hour}` : undefined}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="size-3 rounded bg-blue-500" />
                <span>Computer Science</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="size-3 rounded bg-emerald-500" />
                <span>Mathematics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="size-3 rounded bg-violet-500" />
                <span>Data Structures</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="size-3 rounded bg-amber-500" />
                <span>Physics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Schedules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Schedules</CardTitle>
              <CardDescription>Recent and active schedules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSchedules.map((schedule) => (
                <Link key={schedule.id} to="/app/schedule">
                  <div className="group p-3 -mx-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${
                          schedule.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                        }`} />
                        <span className="text-sm font-medium">{schedule.name}</span>
                      </div>
                      <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {schedule.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>{schedule.sessions} classes</span>
                      <span>{schedule.progress}% complete</span>
                    </div>
                    <Progress value={schedule.progress} className="h-1.5" />
                  </div>
                </Link>
              ))}
              <Button variant="outline" className="w-full mt-2" size="sm" asChild>
                <Link to="/app/schedule">
                  View All
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activityItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`rounded-lg p-1.5 ${item.bg}`}>
                    <item.icon className={`size-3.5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none mb-1">{item.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/app/buildings">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-3 transition-transform group-hover:scale-110">
                <Building2 className="size-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-3xl font-bold"><CountUp value="3" /></p>
                <p className="text-sm text-muted-foreground">Buildings</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>
        <Link to="/app/schedule">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 p-3 transition-transform group-hover:scale-110">
                <Clock className="size-6 text-violet-500" />
              </div>
              <div className="flex-1">
                <p className="text-3xl font-bold"><CountUp value="213" suffix="h" /></p>
                <p className="text-sm text-muted-foreground">Teaching Hours</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>
        <Link to="/app/rooms">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-3 transition-transform group-hover:scale-110">
                <TrendingUp className="size-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-3xl font-bold"><CountUp value="87" suffix="%" /></p>
                <p className="text-sm text-muted-foreground">Room Utilization</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
