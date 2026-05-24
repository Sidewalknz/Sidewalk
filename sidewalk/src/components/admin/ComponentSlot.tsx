'use client'

import React from 'react'
import { UI_REGISTRY } from '@/lib/ui-registry'

/**
 * A generic slot that renders any components registered for the given name.
 * Used for modular UI extensions without hardcoding references.
 */
export function ComponentSlot({ name, props = {} }: { name: string; props?: any }) {
  const components = UI_REGISTRY[name] || []

  return (
    <>
      {components.map((Component, idx) => (
        <Component key={idx} {...props} />
      ))}
    </>
  )
}

