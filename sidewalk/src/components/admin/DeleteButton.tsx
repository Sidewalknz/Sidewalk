'use client'

import React, { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteButtonProps {
    id: string | number
    itemName: string
    action: (id: any) => Promise<{ message: string }>
}

export default function DeleteButton({ id, itemName, action }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [confirmed, setConfirmed] = useState(false)

    const handleDelete = async () => {
        if (!confirmed) {
            setConfirmed(true)
            // Reset confirmation after 3 seconds if not clicked again
            setTimeout(() => setConfirmed(false), 3000)
            return
        }

        startTransition(async () => {
            const result = await action(id)
            if (result.message && !result.message.toLowerCase().includes('success')) {
                alert(result.message)
            }
            setConfirmed(false)
        })
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-medium ${
                confirmed 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'text-zinc-500 hover:text-red-500 hover:bg-red-500/10'
            }`}
            title={confirmed ? `Click again to confirm delete ${itemName}` : `Delete ${itemName}`}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : confirmed ? (
                <>
                    <Trash2 className="h-4 w-4" />
                    <span>Confirm</span>
                </>
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </button>
    )
}
