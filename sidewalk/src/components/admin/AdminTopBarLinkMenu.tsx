"use client"

import * as React from "react"

import Link from "next/link"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { AdminTopBarIconButton } from "@/components/admin/AdminTopBarIconButton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AdminTopBarLinkMenuItem = {
  href: string
  label: React.ReactNode
  active?: boolean
}

export function AdminTopBarLinkMenu({
  title,
  ariaLabel,
  icon,
  items,
  align = "end",
  className,
}: {
  title?: string
  ariaLabel: string
  icon: React.ReactNode
  items: AdminTopBarLinkMenuItem[]
  align?: "start" | "end" | "center"
  className?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AdminTopBarIconButton title={title ?? ariaLabel} ariaLabel={ariaLabel} className={className}>
          {icon}
        </AdminTopBarIconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-56">
        {title ? (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}

        {items.map((item, idx) => (
          <DropdownMenuItem key={`${idx}-${String(item.href)}`} asChild>
            <Link
              href={item.href}
              className={cn(
                "w-full flex items-center justify-between gap-3",
                item.active ? "font-bold text-slate-900 dark:text-white" : ""
              )}
            >
              <span>{item.label}</span>
              {item.active ? <Check className="w-4 h-4 text-brand-600" /> : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
