import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NumberInput } from '@/components/ui/number-input'
import { Badge } from '@/components/ui/badge'
import { Building2, DoorOpen, FlaskConical, Presentation, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateRoomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (room: RoomFormData) => void
}

interface RoomFormData {
  name: string
  building: string
  type: string
  capacity: number
}

const buildings = [
  { id: '1', name: 'Science Building', code: 'SCI' },
  { id: '2', name: 'Engineering Building', code: 'ENG' },
  { id: '3', name: 'Arts Building', code: 'ART' },
  { id: '4', name: 'Library', code: 'LIB' },
  { id: '5', name: 'Student Center', code: 'STU' },
]

const roomTypes = [
  { value: 'Lecture Hall', icon: Presentation, color: 'blue', description: 'Large tiered seating' },
  { value: 'Classroom', icon: DoorOpen, color: 'violet', description: 'Standard classroom' },
  { value: 'Lab', icon: FlaskConical, color: 'emerald', description: 'Practical sessions' },
]

export function CreateRoomModal({ open, onOpenChange, onSubmit }: CreateRoomModalProps) {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    building: '',
    type: 'Classroom',
    capacity: 40,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    onOpenChange(false)
    setFormData({
      name: '',
      building: '',
      type: 'Classroom',
      capacity: 40,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-violet-500/10">
            <DoorOpen className="size-6 text-violet-500" />
          </div>
          <div className="space-y-1 text-center">
            <DialogTitle className="text-xl">Add New Room</DialogTitle>
            <DialogDescription>
              Register a new room in your campus inventory
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Room Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Room Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {roomTypes.map((type) => {
                const Icon = type.icon
                const isSelected = formData.type === type.value
                const colorClasses = {
                  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500' },
                  violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500' },
                  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500' },
                }[type.color] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' }

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all hover:border-primary/50',
                      isSelected
                        ? `${colorClasses.border} ${colorClasses.bg}`
                        : 'border-muted bg-transparent'
                    )}
                  >
                    <Icon className={cn(
                      'size-5',
                      isSelected ? colorClasses.text : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      'text-xs font-medium',
                      isSelected ? colorClasses.text : 'text-foreground'
                    )}>{type.value}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Room Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Room Name / Number</Label>
              <Input
                id="name"
                placeholder="Room 101 or Lab A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="building" className="text-sm">Building</Label>
              <Select
                value={formData.building}
                onValueChange={(value) => setFormData({ ...formData, building: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.name}>
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-muted-foreground" />
                        <span>{building.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">({building.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm flex items-center gap-1">
              <Users className="size-3 text-muted-foreground" />
              Seating Capacity
            </Label>
            <NumberInput
              value={formData.capacity}
              onChange={(value) => setFormData({ ...formData, capacity: value })}
              min={1}
              max={500}
              step={5}
            />
          </div>

          {/* Summary */}
          {formData.name && formData.building && (
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-500/10 p-2">
                  {(() => {
                    const Icon = roomTypes.find(t => t.value === formData.type)?.icon || DoorOpen
                    return <Icon className="size-4 text-violet-500" />
                  })()}
                </div>
                <div>
                  <p className="font-medium text-sm">{formData.name}</p>
                  <p className="text-xs text-muted-foreground">{formData.building}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                <Users className="size-3 mr-1" />
                {formData.capacity} seats
              </Badge>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
