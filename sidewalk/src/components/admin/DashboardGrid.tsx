'use client'

import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DashboardWidgetDefinition = {
    id: string
    title: string
    span?: 1 | 2 | 3 | 4
    rows?: 1 | 2 | 3
    className?: string
    content: React.ReactNode
}

interface DashboardWidgetProps {
    id: string
    title: string
    children: React.ReactNode
    className?: string
    span?: 1 | 2 | 3 | 4
    rows?: 1 | 2 | 3
}

type DashboardGridRegistry = {
    register: (providerKey: string, widgets: DashboardWidgetDefinition[]) => void
    unregister: (providerKey: string) => void
}

const DashboardGridRegistryContext = React.createContext<DashboardGridRegistry | null>(null)

export function useDashboardGridRegistration(providerKey: string, widgets: DashboardWidgetDefinition[]) {
    const ctx = React.useContext(DashboardGridRegistryContext)

    useEffect(() => {
        if (!ctx) return
        ctx.register(providerKey, widgets)
        return () => ctx.unregister(providerKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx, providerKey, widgets])
}

function DashboardWidgetCard({ 
    id, title, children, className, span = 1, rows = 1,
    isDragging, onDragStart, onDragOver, onDragEnd, onDrop
}: DashboardWidgetProps & {
    isDragging: boolean
    onDragStart: (e: React.DragEvent, id: string) => void
    onDragOver: (e: React.DragEvent) => void
    onDragEnd: () => void
    onDrop: (e: React.DragEvent, id: string) => void
}) {
    const colSpanClass = span === 2 ? 'md:col-span-2' : span === 3 ? 'md:col-span-3' : span === 4 ? 'md:col-span-4' : ''
    const rowSpanClass = rows === 2 ? 'md:row-span-2' : rows === 3 ? 'md:row-span-3' : ''

    return (
        <div
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, id)}
            className={cn(
                'group/widget relative rounded-3xl overflow-hidden transition-all duration-300',
                'h-full',
                'border-slate-200/60 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none',
                'bg-white dark:bg-slate-900 border',
                isDragging ? 'opacity-40 scale-95 rotate-1' : 'hover:-translate-y-1',
                colSpanClass,
                rowSpanClass,
                className,
            )}
        >
            <div
                className="absolute top-4 right-4 opacity-0 group-hover/widget:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
                title="Drag to reorder"
            >
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
                    <div
                        draggable
                        onDragStart={(e) => onDragStart(e, id)}
                        onDragEnd={onDragEnd}
                        className="cursor-grab active:cursor-grabbing"
                        aria-label="Drag to reorder"
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}

interface DashboardGridProps {
    storageKey?: string
    widgets: DashboardWidgetDefinition[]
    children?: React.ReactNode
}

export function DashboardGrid({ storageKey = 'dashboard-widget-order', widgets, children }: DashboardGridProps) {
    const [orderedIds, setOrderedIds] = useState<string[]>([])
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [providerWidgets, setProviderWidgets] = useState<Record<string, DashboardWidgetDefinition[]>>({})

    const registry = useMemo<DashboardGridRegistry>(() => ({
        register: (providerKey, w) => {
            setProviderWidgets((prev) => ({ ...prev, [providerKey]: w }))
        },
        unregister: (providerKey) => {
            setProviderWidgets((prev) => {
                if (!(providerKey in prev)) return prev
                const next = { ...prev }
                delete next[providerKey]
                return next
            })
        },
    }), [])

    const allWidgets = useMemo(() => {
        const merged = new Map<string, DashboardWidgetDefinition>()
        for (const w of widgets) merged.set(w.id, w)
        for (const w of Object.values(providerWidgets).flat()) merged.set(w.id, w)
        return Array.from(merged.values())
    }, [providerWidgets, widgets])

    const widgetIdSignature = allWidgets.map(w => w.id).join('|')

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                const parsed = JSON.parse(saved) as string[]
                // Merge: keep saved order for existing widgets, append new ones
                const validIds = parsed.filter((id: string) => allWidgets.some(w => w.id === id))
                const newIds = allWidgets.filter(w => !validIds.includes(w.id)).map(w => w.id)
                setOrderedIds([...validIds, ...newIds])
                return
            }
        } catch {}
        setOrderedIds(allWidgets.map(w => w.id))
    }, [widgetIdSignature, storageKey])

    const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
        setDraggedId(id)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', id)
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }, [])

    const handleDragEnd = useCallback(() => {
        setDraggedId(null)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
        e.preventDefault()
        const sourceId = e.dataTransfer.getData('text/plain')
        if (sourceId === targetId) return

        setOrderedIds(prev => {
            const newOrder = [...prev]
            const sourceIdx = newOrder.indexOf(sourceId)
            const targetIdx = newOrder.indexOf(targetId)
            if (sourceIdx === -1 || targetIdx === -1) return prev

            newOrder.splice(sourceIdx, 1)
            newOrder.splice(targetIdx, 0, sourceId)

            try {
                localStorage.setItem(storageKey, JSON.stringify(newOrder))
            } catch {}

            return newOrder
        })
        setDraggedId(null)
    }, [storageKey])

    const orderedWidgets = orderedIds
        .map(id => allWidgets.find(w => w.id === id))
        .filter(Boolean) as typeof widgets

    if (orderedWidgets.length === 0) return null

    return (
        <DashboardGridRegistryContext.Provider value={registry}>
            {children}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 md:auto-rows-[200px] lg:auto-rows-[220px] grid-flow-dense">
                {orderedWidgets.map(widget => (
                    <DashboardWidgetCard
                        key={widget.id}
                        id={widget.id}
                        title={widget.title}
                        span={widget.span}
                        rows={widget.rows}
                        className={widget.className}
                        isDragging={draggedId === widget.id}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                    >
                        {widget.content}
                    </DashboardWidgetCard>
                ))}
            </div>
        </DashboardGridRegistryContext.Provider>
    )
}
