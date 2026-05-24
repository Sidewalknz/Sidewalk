"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const Select = ({ children, defaultValue, onValueChange, name, required }: any) => {
  const [value, setValue] = React.useState(defaultValue || "")
  const childrenArray = React.Children.toArray(children)

  React.useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue)
    }
  }, [defaultValue])
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    if (onValueChange) onValueChange(newValue)
  }

  // Find SelectContent and its items
  const selectContent: any = childrenArray.find((child: any) => 
    child.type === SelectContent || (child.type as any)?.displayName === 'SelectContent'
  )
  const options = selectContent ? React.Children.toArray(selectContent.props.children) : []
  const selectedItem: any = options.find((item: any) => String(item.props.value) === String(value))

  return (
    <div className="relative w-full">
      <select
        name={name}
        required={required}
        value={value}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      >
        <option value="" disabled>Select an option</option>
        {options.map((item: any) => (
          <option key={item.props.value} value={item.props.value}>
            {item.props.children}
          </option>
        ))}
      </select>
      
      {childrenArray.map((child: any) => {
        if (child.type === SelectTrigger || (child.type as any)?.displayName === 'SelectTrigger') {
          // Find SelectValue inside trigger's children to get its placeholder
          const triggerChildren = React.Children.toArray(child.props.children)
          const selectValueChild: any = triggerChildren.find((c: any) => 
            c.type === SelectValue || (c.type as any)?.displayName === 'SelectValue'
          )
          
          return React.cloneElement(child, { 
            children: (
              <>
                <SelectValue placeholder={selectValueChild?.props.placeholder}>
                   {selectedItem ? selectedItem.props.children : null}
                </SelectValue>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </>
            )
          })
        }
        return null
      })}
    </div>
  )
}
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { placeholder?: string }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, children, placeholder, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm", className)}
    {...props}
  >
    {children || placeholder}
  </span>
))
SelectValue.displayName = "SelectValue"

const SelectContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return null
}
SelectContent.displayName = "SelectContent"

const SelectItem = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => {
  return null
}
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
