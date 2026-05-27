import React from 'react'
import { OutgoingsDashboardWidgets } from '@/components/admin/OutgoingsDashboardWidgets';
import { JobBreakdownCalculator } from '@/components/admin/JobBreakdownCalculator';

/**
 * Central registry for modular UI injection slots.
 *
 * Modules register components into slots via `module.json` -> `uiInjections`,
 * which are then appended here by the injector.
 */
export const UI_REGISTRY: Record<string, React.ComponentType<any>[]> = {
  // Admin
  'admin-dashboard-widgets': [OutgoingsDashboardWidgets, JobBreakdownCalculator],

  // Ecommerce (kept here so UI injections work even if ecommerce modules aren't installed first)
  'product-variants-top': [],
  'product-type-selection': [],
  'product-variant-options': [],
  'product-options-bottom': [],
}
