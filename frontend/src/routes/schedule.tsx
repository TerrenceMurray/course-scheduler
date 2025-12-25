import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  BookOpen,
  DoorOpen,
  Users,
  CheckCircle2,
  Printer,
  FileDown,
  AlertTriangle,
  X,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { CountUp } from '@/components/count-up'

export const Route = createFileRoute('/schedule')({
  component: SchedulePage,
})

type Session = {
  id: number
  course: string
  name: string
  room: string
  building: string
  day: string
  startHour: number
  duration: number
  color: string
  enrolled: number
  capacity: number
  instructor: string
}

function SchedulePage() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showConflictWarning, setShowConflictWarning] = useState(true)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8AM to 7PM

  const sessions: Session[] = [
    { id: 1, course: 'CS101', name: 'Intro to CS', room: 'Room 101', building: 'Science Building', day: 'Monday', startHour: 9, duration: 1.5, color: 'blue', enrolled: 120, capacity: 150, instructor: 'Dr. Smith' },
    { id: 2, course: 'MATH101', name: 'Calculus I', room: 'Room 201', building: 'Math Building', day: 'Monday', startHour: 11, duration: 1.5, color: 'emerald', enrolled: 150, capacity: 150, instructor: 'Prof. Johnson' },
    { id: 3, course: 'CS201', name: 'Data Structures', room: 'Lab A', building: 'Science Building', day: 'Tuesday', startHour: 10, duration: 2, color: 'violet', enrolled: 85, capacity: 100, instructor: 'Dr. Williams' },
    { id: 4, course: 'PHYS101', name: 'Physics I', room: 'Room 101', building: 'Science Building', day: 'Wednesday', startHour: 9, duration: 1.5, color: 'amber', enrolled: 110, capacity: 150, instructor: 'Prof. Brown' },
    { id: 5, course: 'CS101', name: 'Intro to CS', room: 'Room 101', building: 'Science Building', day: 'Wednesday', startHour: 14, duration: 1.5, color: 'blue', enrolled: 120, capacity: 150, instructor: 'Dr. Smith' },
    { id: 6, course: 'MATH201', name: 'Linear Algebra', room: 'Room 202', building: 'Math Building', day: 'Thursday', startHour: 11, duration: 1.5, color: 'rose', enrolled: 95, capacity: 100, instructor: 'Prof. Davis' },
    { id: 7, course: 'CS301', name: 'Algorithms', room: 'Room 101', building: 'Science Building', day: 'Friday', startHour: 9, duration: 1.5, color: 'cyan', enrolled: 72, capacity: 80, instructor: 'Dr. Miller' },
    { id: 8, course: 'CS201', name: 'Data Structures', room: 'Lab A', building: 'Science Building', day: 'Friday', startHour: 14, duration: 2, color: 'violet', enrolled: 85, capacity: 100, instructor: 'Dr. Williams' },
  ]

  // Simulated conflict for demo
  const conflicts = [
    { type: 'capacity', message: 'MATH101 is at full capacity (150/150 students)' },
  ]

  const handleExport = (format: string) => {
    // In a real app, this would trigger actual export
    console.log(`Exporting as ${format}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const stats = [
    { title: 'Classes', value: sessions.length.toString(), icon: Calendar, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' },
    { title: 'Courses', value: [...new Set(sessions.map(s => s.course))].length.toString(), icon: BookOpen, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500' },
    { title: 'Rooms', value: [...new Set(sessions.map(s => s.room))].length.toString(), icon: DoorOpen, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
    { title: 'Students', value: sessions.reduce((sum, s) => sum + s.enrolled, 0).toString(), icon: Users, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' },
  ]

  const formatHour = (hour: number) => {
    const h = Math.floor(hour)
    const m = Math.round((hour - h) * 60)
    const suffix = h >= 12 ? 'PM' : 'AM'
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h
    return m === 0 ? `${displayHour} ${suffix}` : `${displayHour}:${m.toString().padStart(2, '0')} ${suffix}`
  }

  const getSessionStyle = (startHour: number, duration: number) => {
    const top = (startHour - 8) * 60
    const height = duration * 60
    return { top: `${top}px`, height: `${height}px` }
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      blue: { bg: 'bg-blue-500/20', border: 'border-l-blue-500', text: 'text-blue-400' },
      emerald: { bg: 'bg-emerald-500/20', border: 'border-l-emerald-500', text: 'text-emerald-400' },
      violet: { bg: 'bg-violet-500/20', border: 'border-l-violet-500', text: 'text-violet-400' },
      amber: { bg: 'bg-amber-500/20', border: 'border-l-amber-500', text: 'text-amber-400' },
      rose: { bg: 'bg-rose-500/20', border: 'border-l-rose-500', text: 'text-rose-400' },
      cyan: { bg: 'bg-cyan-500/20', border: 'border-l-cyan-500', text: 'text-cyan-400' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="flex flex-1 flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Timetable</h1>
          <p className="text-muted-foreground">
            See when and where classes happen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="fall-2024">
            <SelectTrigger className="w-44">
              <Calendar className="mr-2 size-4" />
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fall-2024">Fall 2024</SelectItem>
              <SelectItem value="summer-2024">Summer 2024</SelectItem>
              <SelectItem value="spring-2024">Spring 2024</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Download className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
                <FileDown className="mr-2 size-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('ics')} className="cursor-pointer">
                <Calendar className="mr-2 size-4" />
                Export as Calendar (.ics)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
                <FileDown className="mr-2 size-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint} className="cursor-pointer">
                <Printer className="mr-2 size-4" />
                Print Schedule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Conflict Warning Banner */}
      {showConflictWarning && conflicts.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="size-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-500">Heads up!</p>
            <p className="text-sm text-muted-foreground">
              {conflicts[0].message}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setShowConflictWarning(false)}>
            <X className="size-4" />
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 animate-stagger">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                <stat.icon className={`size-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"><CountUp value={stat.value} /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Tabs */}
      <Tabs defaultValue="week" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="week">Week View</TabsTrigger>
            <TabsTrigger value="room">By Room</TabsTrigger>
            <TabsTrigger value="course">By Course</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="size-8">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="outline" size="icon" className="size-8">
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>

        {/* Week View */}
        <TabsContent value="week">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>This Week</CardTitle>
                  <CardDescription>December 23 - 27, 2024</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    <CheckCircle2 className="mr-1 size-3" />
                    All Good
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-200">
                  {/* Day Headers */}
                  <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b">
                    <div className="p-3 text-xs font-medium text-muted-foreground">
                      <Clock className="size-4" />
                    </div>
                    {days.map((day, i) => (
                      <div key={day} className="p-3 text-center border-l">
                        <div className="text-sm font-medium">{day}</div>
                        <div className="text-xs text-muted-foreground">{23 + i}</div>
                      </div>
                    ))}
                  </div>

                  {/* Time Grid */}
                  <div className="grid grid-cols-[80px_repeat(5,1fr)]">
                    {/* Time Labels */}
                    <div className="border-r">
                      {hours.map((hour) => (
                        <div key={hour} className="h-15 border-b px-3 py-1">
                          <span className="text-xs text-muted-foreground">{formatHour(hour)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Day Columns */}
                    {days.map((day) => (
                      <div key={day} className="relative border-l" style={{ height: `${hours.length * 60}px` }}>
                        {/* Hour lines */}
                        {hours.map((hour) => (
                          <div
                            key={hour}
                            className="absolute w-full border-b border-dashed border-muted/50"
                            style={{ top: `${(hour - 8) * 60}px`, height: '60px' }}
                          />
                        ))}

                        {/* Sessions */}
                        {sessions
                          .filter((s) => s.day === day)
                          .map((session) => {
                            const colors = getColorClasses(session.color)
                            return (
                              <div
                                key={session.id}
                                onClick={() => setSelectedSession(session)}
                                className={`absolute left-1 right-1 rounded-md border-l-4 px-2 py-1.5 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${colors.bg} ${colors.border}`}
                                style={getSessionStyle(session.startHour, session.duration)}
                              >
                                <div className={`text-xs font-semibold ${colors.text}`}>{session.course}</div>
                                <div className="text-xs text-foreground/80 truncate">{session.name}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <DoorOpen className="size-3" />
                                  {session.room}
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Room View */}
        <TabsContent value="room">
          <div className="grid gap-4 md:grid-cols-2">
            {[...new Set(sessions.map(s => s.room))].map((room) => {
              const roomSessions = sessions.filter(s => s.room === room)
              return (
                <Card key={room} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg p-2 bg-primary/10">
                        <DoorOpen className="size-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base leading-none">{room}</CardTitle>
                        <CardDescription className="mt-1">Science Building</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{roomSessions.length} sessions</Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {roomSessions.map((session) => {
                        const colors = getColorClasses(session.color)
                        return (
                          <div
                            key={session.id}
                            onClick={() => setSelectedSession(session)}
                            className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                          >
                            <div className={`w-1 h-10 rounded-full ${colors.border.replace('border-l-', 'bg-')}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold ${colors.text}`}>{session.course}</span>
                                <span className="text-sm text-muted-foreground truncate">{session.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {session.day} • {formatHour(session.startHour)} - {formatHour(session.startHour + session.duration)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="size-3" />
                              {session.enrolled}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* By Course View */}
        <TabsContent value="course">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...new Set(sessions.map(s => s.course))].map((courseCode) => {
              const courseSessions = sessions.filter(s => s.course === courseCode)
              const course = courseSessions[0]
              const colors = getColorClasses(course.color)
              return (
                <Card key={courseCode} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-10 rounded-full ${colors.border.replace('border-l-', 'bg-')}`} />
                      <div>
                        <CardTitle className={`text-base leading-none ${colors.text}`}>{courseCode}</CardTitle>
                        <CardDescription className="mt-1">{course.name}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{courseSessions.length}x/week</Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {courseSessions.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => setSelectedSession(session)}
                          className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="text-sm font-medium">{session.day}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3" />
                              {formatHour(session.startHour)} - {formatHour(session.startHour + session.duration)}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              <DoorOpen className="mr-1 size-3" />
                              {session.room}
                            </Badge>
                            <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                              <Users className="size-3" />
                              {session.enrolled} students
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Session Details Modal */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle className={getColorClasses(selectedSession.color).text}>
                  {selectedSession.course}
                </DialogTitle>
                <DialogDescription>{selectedSession.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Day & Time</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Clock className="size-4" />
                      {selectedSession.day}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatHour(selectedSession.startHour)} - {formatHour(selectedSession.startHour + selectedSession.duration)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <DoorOpen className="size-4" />
                      {selectedSession.room}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3" />
                      {selectedSession.building}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Instructor</p>
                    <p className="text-sm font-medium">{selectedSession.instructor}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Enrollment</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Users className="size-4" />
                      {selectedSession.enrolled} / {selectedSession.capacity}
                    </p>
                    {selectedSession.enrolled >= selectedSession.capacity && (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10">
                        Full
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
