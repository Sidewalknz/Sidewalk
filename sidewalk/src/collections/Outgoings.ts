import type { CollectionConfig } from 'payload'

export const Outgoings: CollectionConfig = {
  slug: 'Outgoings',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'amount', 'frequency', 'category', 'status', 'startDate'],
    group: 'Finance',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'name',
              label: 'Outgoing name',
              type: 'text',
              required: true,
            },
            {
              name: 'amount',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                step: 0.01,
              },
            },
            {
              name: 'frequency',
              type: 'select',
              required: true,
              defaultValue: 'monthly',
              options: [
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ],
            },
            {
              name: 'startDate',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
              },
            },
            {
              name: 'category',
              type: 'text',
              admin: {
                description: 'Examples: Software, Rent, Contractors, Marketing.',
              },
            },
            {
              name: 'adminNotes',
              label: 'Admin notes',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Ended', value: 'ended' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        hidden: true,
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
  timestamps: true,
}
