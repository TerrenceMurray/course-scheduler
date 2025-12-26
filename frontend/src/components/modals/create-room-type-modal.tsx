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
import { Textarea } from '@/components/ui/textarea'
import { NumberInput } from '@/components/ui/number-input'
import { Badge } from '@/components/ui/badge'
import {
  DoorOpen,
  Presentation,
  FlaskConical,
  Palette,
  MessageSquare,
  Monitor,
  Microscope,
  Music,
  Tag,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateRoomTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (roomType: RoomTypeFormData) => void
}

interface RoomTypeFormData {
  name: string
  description: string
  avgCapacity: number
  icon: string
  color: string
}

const iconOptions = [
  { value: 'Presentation', label: 'Lecture Hall', icon: Presentation },
  { value: 'DoorOpen', label: 'Classroom', icon: DoorOpen },
  { value: 'FlaskConical', label: 'Lab', icon: FlaskConical },
  { value: 'Monitor', label: 'Computer', icon: Monitor },
  { value: 'Palette', label: 'Art Studio', icon: Palette },
  { value: 'MessageSquare', label: 'Seminar', icon: MessageSquare },
  { value: 'Microscope', label: 'Science', icon: Microscope },
  { value: 'Music', label: 'Music', icon: Music },
]

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500', ring: 'ring-blue-500', text: 'text-blue-500', bgLight: 'bg-blue-500/10' },
  { value: 'violet', label: 'Violet', class: 'bg-violet-500', ring: 'ring-violet-500', text: 'text-violet-500', bgLight: 'bg-violet-500/10' },
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500', ring: 'ring-emerald-500', text: 'text-emerald-500', bgLight: 'bg-emerald-500/10' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500', ring: 'ring-amber-500', text: 'text-amber-500', bgLight: 'bg-amber-500/10' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500', ring: 'ring-rose-500', text: 'text-rose-500', bgLight: 'bg-rose-500/10' },
]

export function CreateRoomTypeModal({ open, onOpenChange, onSubmit }: CreateRoomTypeModalProps) {
  const [formData, setFormData] = useState<RoomTypeFormData>({
    name: '',
    description: '',
    avgCapacity: 40,
    icon: 'DoorOpen',
    color: 'blue',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    onOpenChange(false)
    setFormData({
      name: '',
      description: '',
      avgCapacity: 40,
      icon: 'DoorOpen',
      color: 'blue',
    })
  }

  const selectedIcon = iconOptions.find(i => i.value === formData.icon) || iconOptions[0]
  const selectedColor = colorOptions.find(c => c.value === formData.color) || colorOptions[0]
  const SelectedIconComponent = selectedIcon.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className={cn(
            'mx-auto flex size-12 items-center justify-center rounded-full',
            selectedColor.bgLight
          )}>
            <Tag className={cn('size-6', selectedColor.text)} />
          </div>
          <div className="space-y-1 text-center">
            <DialogTitle className="text-xl">Create Room Type</DialogTitle>
            <DialogDescription>
              Define a new category for organizing your rooms
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Icon Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Icon</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
              {iconOptions.map((option) => {
                const Icon = option.icon
                const isSelected = formData.icon === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: option.value })}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition-all hover:border-primary/50 w-16',
                      isSelected
                        ? `${selectedColor.ring.replace('ring', 'border')} ${selectedColor.bgLight}`
                        : 'border-muted bg-transparent'
                    )}
                  >
                    <Icon className={cn(
                      'size-5',
                      isSelected ? selectedColor.text : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      'text-[10px] font-medium truncate w-full text-center',
                      isSelected ? selectedColor.text : 'text-muted-foreground'
                    )}>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex gap-2 justify-center">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={cn(
                    'size-8 rounded-full transition-all',
                    color.class,
                    formData.color === color.value
                      ? `ring-2 ring-offset-2 ${color.ring}`
                      : 'opacity-50 hover:opacity-100'
                  )}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Type Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Type Name</Label>
              <Input
                id="name"
                placeholder="e.g., Computer Lab, Art Studio"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this room type is used for..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgCapacity" className="text-sm flex items-center gap-1">
                <Users className="size-3 text-muted-foreground" />
                Average Capacity
              </Label>
              <div className="flex items-center gap-4">
                <NumberInput
                  value={formData.avgCapacity}
                  onChange={(value) => setFormData({ ...formData, avgCapacity: value })}
                  min={1}
                  max={500}
                  step={5}
                  className="w-40"
                />
                <p className="text-xs text-muted-foreground flex-1">
                  Typical seating capacity for rooms of this type
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.name && (
            <div className={cn(
              'rounded-lg border p-4',
              `border-${formData.color}-500/20 bg-${formData.color}-500/5`
            )}>
              <div className="flex items-start gap-3">
                <div className={cn('rounded-lg p-2.5', selectedColor.bgLight)}>
                  <SelectedIconComponent className={cn('size-5', selectedColor.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{formData.name}</p>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      ~{formData.avgCapacity} seats
                    </Badge>
                  </div>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Type</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
