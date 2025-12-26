import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'light' | 'dark'
  showText?: boolean
}

export function Logo({ className, size = 'md', variant = 'default', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'size-6', text: 'text-sm', gap: 'gap-2' },
    md: { icon: 'size-8', text: 'text-base', gap: 'gap-2.5' },
    lg: { icon: 'size-10', text: 'text-lg', gap: 'gap-3' },
  }

  const variants = {
    default: {
      bg: 'bg-primary',
      icon: 'text-primary-foreground',
      text: 'text-foreground',
    },
    light: {
      bg: 'bg-white/10 backdrop-blur',
      icon: 'text-white',
      text: 'text-white',
    },
    dark: {
      bg: 'bg-zinc-900',
      icon: 'text-white',
      text: 'text-zinc-900 dark:text-white',
    },
  }

  const s = sizes[size]
  const v = variants[variant]

  return (
    <div className={cn('flex items-center font-semibold', s.gap, className)}>
      <div className={cn('flex items-center justify-center rounded-lg', s.icon, v.bg)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn('size-[55%]', v.icon)}
        >
          {/* Grid pattern representing schedule */}
          <rect x="2" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.9" />
          <rect x="9" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="16" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="2" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="16" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
          <rect x="2" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="9" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
          <rect x="16" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.9" />
        </svg>
      </div>
      {showText && (
        <span className={cn('font-semibold', s.text, v.text)}>
          Course Scheduler
        </span>
      )}
    </div>
  )
}

interface LogoIconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function LogoIcon({ className, size = 'md' }: LogoIconProps) {
  const sizes = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-10',
    xl: 'size-12',
  }

  return (
    <div className={cn('flex items-center justify-center rounded-lg bg-primary text-primary-foreground', sizes[size], className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-[55%]"
      >
        {/* Grid pattern representing schedule */}
        <rect x="2" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.9" />
        <rect x="9" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="16" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="2" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.8" />
        <rect x="16" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="2" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="9" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="16" y="16" width="6" height="6" rx="1" fill="currentColor" opacity="0.9" />
      </svg>
    </div>
  )
}
