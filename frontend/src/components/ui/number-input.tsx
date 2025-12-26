import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  className,
  disabled,
  ...props
}: NumberInputProps) {
  const handleIncrement = () => {
    const newValue = Math.min(value + step, max)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min)
    onChange(newValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)))
    }
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9 rounded-r-none border-r-0 shrink-0"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
      >
        <Minus className="size-3" />
      </Button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'flex h-9 w-full border border-input bg-transparent px-3 py-1 text-center text-sm shadow-xs transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        {...props}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9 rounded-l-none border-l-0 shrink-0"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
      >
        <Plus className="size-3" />
      </Button>
    </div>
  )
}
