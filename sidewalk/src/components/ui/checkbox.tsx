"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(event)
      if (onCheckedChange) onCheckedChange(event.target.checked)
    }

    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          onChange={handleChange}
          className={cn(
            "peer h-6 w-6 shrink-0 appearance-none rounded-lg border-2 border-slate-200 dark:border-slate-700 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-brand-600 checked:border-brand-600 transition-all cursor-pointer",
            className
          )}
          {...props}
        />
        <svg
          className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
