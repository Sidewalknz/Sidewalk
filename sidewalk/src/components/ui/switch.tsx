"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(event)
      if (onCheckedChange) onCheckedChange(event.target.checked)
    }

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-5 w-9 shrink-0 rounded-full border-2 border-transparent shadow-sm transition-colors",
            "bg-slate-200 dark:bg-slate-800",
            "peer-checked:bg-brand-600",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            className
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
            "translate-x-0 peer-checked:translate-x-4"
          )}
        />
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
