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
import { Building2, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateBuildingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (building: BuildingFormData) => void
}

interface BuildingFormData {
  name: string
  code: string
  color: string
}

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500', ring: 'ring-blue-500' },
  { value: 'violet', label: 'Violet', class: 'bg-violet-500', ring: 'ring-violet-500' },
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500', ring: 'ring-emerald-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500', ring: 'ring-amber-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500', ring: 'ring-rose-500' },
]

export function CreateBuildingModal({ open, onOpenChange, onSubmit }: CreateBuildingModalProps) {
  const [formData, setFormData] = useState<BuildingFormData>({
    name: '',
    code: '',
    color: 'blue',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    onOpenChange(false)
    setFormData({
      name: '',
      code: '',
      color: 'blue',
    })
  }

  const selectedColor = colorOptions.find(c => c.value === formData.color) || colorOptions[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className={cn(
            'mx-auto flex size-12 items-center justify-center rounded-full',
            `${selectedColor.class}/10`
          )}>
            <Building2 className={cn('size-6', `text-${formData.color}-500`)} />
          </div>
          <div className="space-y-1 text-center">
            <DialogTitle className="text-xl">Add New Building</DialogTitle>
            <DialogDescription>
              Register a new campus building to your inventory
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Building Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Building Name</Label>
              <Input
                id="name"
                placeholder="Science Building"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm">
                <Hash className="inline size-3 mr-1 text-muted-foreground" />
                Building Code
              </Label>
              <Input
                id="code"
                placeholder="SCI"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                maxLength={5}
                className="font-mono uppercase w-32"
                required
              />
              <p className="text-xs text-muted-foreground">3-5 character abbreviation</p>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Color Theme</Label>
            <div className="flex gap-3 justify-center">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={cn(
                    'size-10 rounded-full transition-all',
                    color.class,
                    formData.color === color.value
                      ? `ring-2 ring-offset-2 ${color.ring}`
                      : 'opacity-60 hover:opacity-100'
                  )}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {formData.name && formData.code && (
            <div className={cn(
              'rounded-lg border p-4',
              `border-${formData.color}-500/20 bg-${formData.color}-500/5`
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  'rounded-lg p-2.5',
                  `bg-${formData.color}-500/10`
                )}>
                  <Building2 className={cn('size-5', `text-${formData.color}-500`)} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{formData.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{formData.code}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Building</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
