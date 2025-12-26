import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  Users,
  DoorOpen,
  Building2,
  Search,
  MoreHorizontal,
  Presentation,
  FlaskConical,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CountUp } from '@/components/count-up'
import { CreateRoomModal } from '@/components/modals'

export const Route = createFileRoute('/app/rooms')({
  component: RoomsPage,
})

function RoomsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const rooms = [
    { id: '1', name: 'Room 101', building: 'Science Building', type: 'Lecture Hall', capacity: 120, utilization: 85, available: true },
    { id: '2', name: 'Room 102', building: 'Science Building', type: 'Classroom', capacity: 40, utilization: 72, available: true },
    { id: '3', name: 'Lab A', building: 'Science Building', type: 'Lab', capacity: 30, utilization: 90, available: false },
    { id: '4', name: 'Room 201', building: 'Engineering Building', type: 'Lecture Hall', capacity: 100, utilization: 78, available: true },
    { id: '5', name: 'Room 202', building: 'Engineering Building', type: 'Classroom', capacity: 35, utilization: 65, available: true },
    { id: '6', name: 'Lab B', building: 'Engineering Building', type: 'Lab', capacity: 25, utilization: 88, available: false },
    { id: '7', name: 'Room 301', building: 'Arts Building', type: 'Classroom', capacity: 45, utilization: 55, available: true },
    { id: '8', name: 'Auditorium', building: 'Arts Building', type: 'Lecture Hall', capacity: 200, utilization: 45, available: true },
  ]

  const stats = [
    {
      title: 'Total Rooms',
      value: rooms.length.toString(),
      icon: DoorOpen,
      description: 'Across all buildings',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total Capacity',
      value: rooms.reduce((sum, r) => sum + r.capacity, 0).toString(),
      icon: Users,
      description: 'Combined seating',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
    },
    {
      title: 'Available Now',
      value: rooms.filter(r => r.available).length.toString(),
      icon: CheckCircle2,
      description: 'Ready for scheduling',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Avg. Utilization',
      value: Math.round(rooms.reduce((sum, r) => sum + r.utilization, 0) / rooms.length) + '%',
      icon: Calendar,
      description: 'This semester',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
    },
  ]

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: typeof DoorOpen; bg: string; text: string; border: string }> = {
      'Lecture Hall': {
        icon: Presentation,
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
        border: 'border-blue-500/20',
      },
      'Classroom': {
        icon: DoorOpen,
        bg: 'bg-violet-500/10',
        text: 'text-violet-500',
        border: 'border-violet-500/20',
      },
      'Lab': {
        icon: FlaskConical,
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        border: 'border-emerald-500/20',
      },
    }
    return configs[type] || configs['Classroom']
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'bg-emerald-500'
    if (utilization >= 60) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground">
            Manage available rooms and their capacities
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Room
        </Button>
      </div>

      <CreateRoomModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={(data) => console.log('New room:', data)}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-stagger">
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
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Rooms</CardTitle>
              <CardDescription>Browse and manage room inventory</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search rooms..." className="pl-9 w-48" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-44">
                  <Building2 className="mr-2 size-4" />
                  <SelectValue placeholder="Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  <SelectItem value="science">Science Building</SelectItem>
                  <SelectItem value="engineering">Engineering Building</SelectItem>
                  <SelectItem value="arts">Arts Building</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lecture">Lecture Hall</SelectItem>
                  <SelectItem value="classroom">Classroom</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`size-9 rounded-r-none ${viewMode === 'grid' ? 'bg-muted' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`size-9 rounded-l-none ${viewMode === 'list' ? 'bg-muted' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rooms.map((room) => {
                const typeConfig = getTypeConfig(room.type)
                const TypeIcon = typeConfig.icon
                return (
                  <Card
                    key={room.id}
                    className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`rounded-lg p-2.5 ${typeConfig.bg}`}>
                          <TypeIcon className={`size-5 ${typeConfig.text}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          {room.available ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                              In Use
                            </Badge>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 size-4" />
                                View Schedule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardTitle className="text-base">{room.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building2 className="size-3" />
                        {room.building}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className={`${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
                          {room.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">{room.capacity}</span>
                        </div>
                      </div>
                      {/* Utilization Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Utilization</span>
                          <span className="font-medium">{room.utilization}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${getUtilizationColor(room.utilization)}`}
                            style={{ width: `${room.utilization}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Capacity</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => {
                  const typeConfig = getTypeConfig(room.type)
                  const TypeIcon = typeConfig.icon
                  return (
                    <TableRow key={room.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`flex size-9 items-center justify-center rounded-lg ${typeConfig.bg}`}>
                            <TypeIcon className={`size-4 ${typeConfig.text}`} />
                          </div>
                          <span className="font-medium">{room.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Building2 className="size-3" />
                          {room.building}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
                          {room.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">{room.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${getUtilizationColor(room.utilization)}`}
                              style={{ width: `${room.utilization}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-8">{room.utilization}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {room.available ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                            In Use
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 size-4" />
                              View Schedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
