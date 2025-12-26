import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Plus,
  DoorOpen,
  MoreHorizontal,
  Building2,
  Users,
  MapPin,
  Pencil,
  Trash2,
  ExternalLink,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateBuildingModal } from '@/components/modals'

export const Route = createFileRoute('/app/buildings')({
  component: BuildingsPage,
})

function BuildingsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const buildings = [
    {
      id: '1',
      name: 'Science Building',
      code: 'SCI',
      roomCount: 12,
      totalCapacity: 580,
      floors: 3,
      utilization: 82,
      color: 'blue',
    },
    {
      id: '2',
      name: 'Engineering Building',
      code: 'ENG',
      roomCount: 15,
      totalCapacity: 720,
      floors: 4,
      utilization: 78,
      color: 'violet',
    },
    {
      id: '3',
      name: 'Arts Building',
      code: 'ART',
      roomCount: 8,
      totalCapacity: 340,
      floors: 2,
      utilization: 65,
      color: 'amber',
    },
    {
      id: '4',
      name: 'Library',
      code: 'LIB',
      roomCount: 6,
      totalCapacity: 180,
      floors: 3,
      utilization: 90,
      color: 'emerald',
    },
    {
      id: '5',
      name: 'Student Center',
      code: 'STU',
      roomCount: 4,
      totalCapacity: 150,
      floors: 2,
      utilization: 55,
      color: 'rose',
    },
  ]

  const totalRooms = buildings.reduce((sum, b) => sum + b.roomCount, 0)
  const totalCapacity = buildings.reduce((sum, b) => sum + b.totalCapacity, 0)
  const avgUtilization = Math.round(buildings.reduce((sum, b) => sum + b.utilization, 0) / buildings.length)

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; badge: string; ring: string }> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', badge: 'bg-blue-500', ring: 'ring-blue-500/20' },
      violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', badge: 'bg-violet-500', ring: 'ring-violet-500/20' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', badge: 'bg-amber-500', ring: 'ring-amber-500/20' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', badge: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
      rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', badge: 'bg-rose-500', ring: 'ring-rose-500/20' },
    }
    return colors[color] || colors.blue
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'text-emerald-500'
    if (utilization >= 60) return 'text-amber-500'
    return 'text-rose-500'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buildings</h1>
          <p className="text-muted-foreground">
            Manage campus buildings and their facilities
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Building
        </Button>
      </div>

      <CreateBuildingModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={(data) => console.log('New building:', data)}
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4 animate-stagger">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{buildings.length}</p>
              <p className="text-sm text-muted-foreground">Buildings</p>
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
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgUtilization}%</p>
              <p className="text-sm text-muted-foreground">Avg. Utilization</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buildings Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">All Buildings</h2>
          <p className="text-sm text-muted-foreground">Click on a building to manage its rooms</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => {
            const colors = getColorClasses(building.color)
            return (
              <Card
                key={building.id}
                className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2.5 ${colors.bg}`}>
                        <Building2 className={`size-5 ${colors.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{building.name}</CardTitle>
                        <CardDescription className="font-mono text-xs">
                          {building.code}
                        </CardDescription>
                      </div>
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
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 size-4" />
                          View on Map
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <DoorOpen className="size-3" />
                        Rooms
                      </div>
                      <p className="font-semibold">{building.roomCount}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="size-3" />
                        Capacity
                      </div>
                      <p className="font-semibold">{building.totalCapacity}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <MapPin className="size-3" />
                        Floors
                      </div>
                      <p className="font-semibold">{building.floors}</p>
                    </div>
                  </div>

                  {/* Utilization */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="size-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Utilization</span>
                      </div>
                      <span className={`font-semibold ${getUtilizationColor(building.utilization)}`}>
                        {building.utilization}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${colors.badge}`}
                        style={{ width: `${building.utilization}%` }}
                      />
                    </div>
                  </div>

                  {/* Room Distribution Mini Visualization */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(building.roomCount, 15) }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${colors.badge}`}
                        style={{ opacity: 0.4 + (i % 3) * 0.2 }}
                      />
                    ))}
                    {building.roomCount > 15 && (
                      <Badge variant="secondary" className="text-xs h-4 px-1">
                        +{building.roomCount - 15}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Add New Card */}
          <Card
            className="flex items-center justify-center border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors min-h-80"
            onClick={() => setCreateModalOpen(true)}
          >
            <CardContent className="flex flex-col items-center gap-2 text-center p-6">
              <div className="rounded-full bg-muted p-3">
                <Plus className="size-5 text-muted-foreground" />
              </div>
              <p className="font-medium">Add New Building</p>
              <p className="text-sm text-muted-foreground">Register a new campus building</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
