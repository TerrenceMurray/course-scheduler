import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  MoreHorizontal,
  Tag,
  DoorOpen,
  Presentation,
  FlaskConical,
  Palette,
  MessageSquare,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { CreateRoomTypeModal } from '@/components/modals'

export const Route = createFileRoute('/app/room-types')({
  component: RoomTypesPage,
})

function RoomTypesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const roomTypes = [
    {
      id: '1',
      name: 'Lecture Hall',
      description: 'Large rooms for lectures with tiered seating',
      roomCount: 5,
      avgCapacity: 200,
      icon: Presentation,
      color: 'blue',
    },
    {
      id: '2',
      name: 'Classroom',
      description: 'Standard classrooms for seminars and classes',
      roomCount: 12,
      avgCapacity: 40,
      icon: DoorOpen,
      color: 'violet',
    },
    {
      id: '3',
      name: 'Computer Lab',
      description: 'Computer laboratories with workstations',
      roomCount: 6,
      avgCapacity: 30,
      icon: FlaskConical,
      color: 'emerald',
    },
    {
      id: '4',
      name: 'Art Studio',
      description: 'Creative spaces for art and design',
      roomCount: 3,
      avgCapacity: 25,
      icon: Palette,
      color: 'amber',
    },
    {
      id: '5',
      name: 'Seminar Room',
      description: 'Small rooms for discussions and meetings',
      roomCount: 8,
      avgCapacity: 20,
      icon: MessageSquare,
      color: 'rose',
    },
  ]

  const totalRooms = roomTypes.reduce((sum, t) => sum + t.roomCount, 0)
  const totalCapacity = roomTypes.reduce((sum, t) => sum + t.roomCount * t.avgCapacity, 0)

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
      blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
        border: 'border-blue-500/20',
        badge: 'bg-blue-500',
      },
      violet: {
        bg: 'bg-violet-500/10',
        text: 'text-violet-500',
        border: 'border-violet-500/20',
        badge: 'bg-violet-500',
      },
      emerald: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        border: 'border-emerald-500/20',
        badge: 'bg-emerald-500',
      },
      amber: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-500',
        border: 'border-amber-500/20',
        badge: 'bg-amber-500',
      },
      rose: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-500',
        border: 'border-rose-500/20',
        badge: 'bg-rose-500',
      },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="flex flex-1 flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Room Types</h1>
          <p className="text-muted-foreground">
            Define and manage categories for your rooms
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Room Type
        </Button>
      </div>

      <CreateRoomTypeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={(data) => console.log('New room type:', data)}
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 animate-stagger">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Tag className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roomTypes.length}</p>
              <p className="text-sm text-muted-foreground">Room Types</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <DoorOpen className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalRooms}</p>
              <p className="text-sm text-muted-foreground">Total Rooms</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCapacity.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Types Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">All Room Types</h2>
          <p className="text-sm text-muted-foreground">Click on a type to view its rooms</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roomTypes.map((type) => {
            const colors = getColorClasses(type.color)
            const Icon = type.icon
            return (
              <Card
                key={type.id}
                className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg p-2.5 ${colors.bg}`}>
                      <Icon className={`size-5 ${colors.text}`} />
                    </div>
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
                          <DoorOpen className="mr-2 size-4" />
                          View Rooms
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-base">{type.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`size-2 rounded-full ${colors.badge}`} />
                        <span className="text-sm font-medium">{type.roomCount}</span>
                        <span className="text-sm text-muted-foreground">rooms</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      ~{type.avgCapacity} seats
                    </Badge>
                  </div>
                  {/* Room Count Visualization */}
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: Math.min(type.roomCount, 12) }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${colors.badge} opacity-${100 - i * 5}`}
                        style={{ opacity: 1 - i * 0.06 }}
                      />
                    ))}
                    {type.roomCount > 12 && (
                      <span className="text-xs text-muted-foreground ml-1">+{type.roomCount - 12}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Add New Card */}
          <Card
            className="flex items-center justify-center border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors min-h-52"
            onClick={() => setCreateModalOpen(true)}
          >
            <CardContent className="flex flex-col items-center gap-2 text-center p-6">
              <div className="rounded-full bg-muted p-3">
                <Plus className="size-5 text-muted-foreground" />
              </div>
              <p className="font-medium">Add New Type</p>
              <p className="text-sm text-muted-foreground">Create a new room category</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
