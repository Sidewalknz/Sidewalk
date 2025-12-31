import type { CollectionConfig } from 'payload'

// Helper function to calculate next due date based on start date and frequency
function calculateNextDueDate(startDate: string | Date | null | undefined, frequency: string): Date | null {
  if (!startDate) return null

  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const now = new Date()
  let nextDue = new Date(start)

  // Calculate the next due date
  while (nextDue <= now) {
    if (frequency === 'weekly') {
      nextDue.setDate(nextDue.getDate() + 7)
    } else if (frequency === 'monthly') {
      nextDue.setMonth(nextDue.getMonth() + 1)
    } else if (frequency === 'yearly') {
      nextDue.setFullYear(nextDue.getFullYear() + 1)
    } else {
      break
    }
  }

  return nextDue
}

export const OngoingExpenses: CollectionConfig = {
  slug: 'ongoing-expenses',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'amount', 'frequency', 'nextDueDate'],
  },
  access: {
    read: () => true, // Allow public read access
  },
  hooks: {
    afterRead: [
      async ({ doc }) => {
        // Calculate and add nextDueDate as a computed field
        if (doc.startDate && doc.frequency) {
          doc.nextDueDate = calculateNextDueDate(doc.startDate, doc.frequency)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Expense Name',
      admin: {
        description: 'Name or description of the ongoing expense',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount',
      admin: {
        description: 'The cost amount for this expense',
      },
    },
    {
      name: 'frequency',
      type: 'select',
      required: true,
      label: 'Frequency',
      options: [
        {
          label: 'Weekly',
          value: 'weekly',
        },
        {
          label: 'Monthly',
          value: 'monthly',
        },
        {
          label: 'Yearly',
          value: 'yearly',
        },
      ],
      defaultValue: 'monthly',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
      admin: {
        description: 'When did this expense start? The next due date will be calculated automatically based on this date and frequency.',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'nextDueDate',
      type: 'date',
      label: 'Next Due Date',
      admin: {
        description: 'Automatically calculated based on start date and frequency',
        readOnly: true,
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
      hooks: {
        afterRead: [
          ({ value, siblingData }) => {
            // Calculate next due date from start date and frequency
            if (siblingData.startDate && siblingData.frequency) {
              return calculateNextDueDate(siblingData.startDate, siblingData.frequency)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category',
      admin: {
        description: 'Optional category for organizing expenses (e.g., Software, Hosting, Services)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Additional notes about this expense',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Whether this expense is currently active',
      },
    },
  ],
}

