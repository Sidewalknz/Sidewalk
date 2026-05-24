'use client'

import * as React from "react"

import { Plus } from "lucide-react"

import { AdminTopBarIconButtonLink } from "@/components/admin/AdminTopBarIconButton"

export function AdminAddButtonLink({
  href,
  title = "Add",
  ariaLabel,
}: {
  href: string
  title?: string
  ariaLabel?: string
}) {
  return (
    <AdminTopBarIconButtonLink href={href} title={title} ariaLabel={ariaLabel ?? title}>
      <Plus className="w-4 h-4" />
    </AdminTopBarIconButtonLink>
  )
}
