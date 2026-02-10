import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['icon', 'companyName', 'ownerName', 'type', 'email', 'totalCost'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              required: true,
              label: 'Company Name',
            },
            {
              name: 'ownerName',
              type: 'text',
              required: true,
              label: "Owner's Name",
            },
            {
              name: 'website',
              type: 'text',
              label: 'Website',
              validate: (val: string | null | undefined) => {
                if (val && val.length > 0 && !val.match(/^https?:\/\/.+/)) {
                  return 'Website must start with http:// or https://'
                }
                return true
              },
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              label: 'Email',
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone',
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              label: 'Type',
              options: [
                {
                  label: 'Ecommerce',
                  value: 'ecommerce',
                },
                {
                  label: 'Portfolio',
                  value: 'portfolio',
                },
                {
                  label: 'Business',
                  value: 'business',
                },
                {
                  label: 'Blog',
                  value: 'blog',
                },
                {
                  label: 'Other',
                  value: 'other',
                },
              ],
              defaultValue: 'business',
            },
          ],
        },
        {
          label: 'Products & Pricing',
          fields: [
            {
              name: 'products',
              type: 'array',
              label: 'Products',
              required: true,
              minRows: 1,
              admin: {
                description: 'What the client paid for (can add multiple products)',
              },
              fields: [
                {
                  name: 'category',
                  type: 'select',
                  label: 'Category',
                  options: [
                    {
                      label: 'Website',
                      value: 'website',
                    },
                    {
                      label: 'Posters',
                      value: 'posters',
                    },
                    {
                      label: 'Logos',
                      value: 'logos',
                    },
                    {
                      label: 'Branding',
                      value: 'branding',
                    },
                    {
                      label: 'Social Media',
                      value: 'social-media',
                    },
                    {
                      label: 'Print Design',
                      value: 'print-design',
                    },
                    {
                      label: 'Web Development',
                      value: 'web-development',
                    },
                    {
                      label: 'Consulting',
                      value: 'consulting',
                    },
                    {
                      label: 'Other',
                      value: 'other',
                    },
                  ],
                  admin: {
                    description: 'Category of this product',
                  },
                },
                {
                  name: 'productName',
                  type: 'text',
                  required: true,
                  label: 'Product Name',
                },
                {
                  name: 'productDescription',
                  type: 'textarea',
                  label: 'Product Description',
                },
                {
                  name: 'startDate',
                  type: 'date',
                  label: 'Project Start Date',
                  admin: {
                    description: 'When did this project start?',
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  label: 'Project End Date',
                  admin: {
                    description: 'When did this project end?',
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  label: 'Price',
                  admin: {
                    description: 'The price paid for this product',
                  },
                },
                {
                  name: 'monthlyFee',
                  type: 'number',
                  label: 'Monthly Fee',
                  admin: {
                    description: 'Monthly recurring fee for this product',
                  },
                },
                {
                  name: 'dueDate',
                  type: 'date',
                  label: 'Due Date',
                  admin: {
                    description: 'Payment due date for this product',
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Project Details',
          fields: [
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                description: 'Description of the client/project',
              },
            },

            {
              name: 'features',
              type: 'array',
              label: 'Features',
              admin: {
                description: 'List of features for this project',
              },
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                  label: 'Feature',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  admin: {
                    description: 'Description of this feature',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'icon',
              type: 'text',
              label: 'Icon URL',
              admin: {
                description: 'URL to the client icon (e.g., /assets/logos/client.svg)',
                components: {
                  Cell: '/components/admin/LogoCell#LogoCell',
                },
              },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Gallery',
              admin: {
                description: 'Multiple images for the client gallery',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption',
                },
              ],
            },
          ],
        },
        {
          label: 'Additional',
          fields: [
            {
              name: 'notes',
              type: 'textarea',
              label: 'Notes',
            },
          ],
        },
      ],
    },
    {
      name: 'totalCost',
      type: 'ui',
      label: 'Total Cost',
      admin: {
        components: {
          Cell: '/components/admin/TotalCostCell#TotalCostCell',
        },
      },
    },
  ],
}

