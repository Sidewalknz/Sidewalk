import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const PortfolioItems: CollectionConfig = {
  slug: 'PortfolioItems',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'clientCompany', 'projectType', 'clientStatus', 'sortOrder'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'shortDescription',
              type: 'textarea',
              admin: { description: 'A short public summary used on cards and listing pages.' },
            },
            {
              name: 'overview',
              type: 'textarea',
              admin: { description: 'Public-facing overview for the portfolio detail page.' },
            },
            { name: 'projectDetails', type: 'textarea', admin: { description: 'Internal scope, notes, and delivery details.' } },
            { name: 'challenge', type: 'textarea' },
            { name: 'solution', type: 'textarea' },
            { name: 'outcome', type: 'textarea' },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Optional client or project logo.' } },
            { name: 'logoUrl', type: 'text', admin: { description: 'Optional external logo URL.' } },
            {
              name: 'backgroundMedia',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Portfolio card/detail background image or video.' },
            },
            {
              name: 'backgroundMediaAlt',
              type: 'text',
              admin: { description: 'Alt text for the background media when it is an image.' },
            },
            {
              name: 'cardTextTone',
              type: 'select',
              defaultValue: 'light',
              options: [
                { label: 'Light text', value: 'light' },
                { label: 'Dark text', value: 'dark' },
              ],
              admin: { description: 'Use dark text when the portfolio card background is white or very light.' },
            },
            {
              name: 'foregroundMedia',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Transparent foreground image or video layered over the card background.' },
            },
            {
              name: 'foregroundMediaAlt',
              type: 'text',
              admin: { description: 'Alt text for the foreground media when it is an image.' },
            },
            { name: 'featuredImage', type: 'upload', relationTo: 'media', admin: { hidden: true } },
            { name: 'featuredImageAlt', type: 'text', admin: { hidden: true } },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'alt', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Client',
          fields: [
            { name: 'clientCompany', type: 'text' },
            { name: 'websiteUrl', type: 'text', admin: { description: 'Public website URL for the portfolio item.' } },
            { name: 'ownerName', type: 'text' },
            { name: 'ownerEmail', type: 'email' },
            { name: 'contactName', type: 'text' },
            { name: 'contactEmail', type: 'email' },
          ],
        },
        {
          label: 'Jobs',
          fields: [
            { name: 'industry', type: 'text', admin: { description: 'Industry or market this work belongs to.' } },
            { name: 'location', type: 'text', admin: { description: 'e.g. "Nelson, NZ"' } },
            { name: 'projectType', type: 'text', admin: { description: 'e.g. Website, branding, renovation, installation.' } },
            { name: 'completionDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
            {
              name: 'services',
              type: 'array',
              admin: { description: 'Services delivered for this item.' },
              fields: [{ name: 'service', type: 'text' }],
            },
            {
              name: 'features',
              type: 'array',
              fields: [{ name: 'feature', type: 'text' }],
            },
            {
              name: 'constraints',
              type: 'array',
              fields: [{ name: 'constraint', type: 'textarea' }],
            },
            {
              name: 'jobs',
              type: 'array',
              admin: { description: 'Track each job, project, product, or service delivered for this client.' },
              fields: [
                { name: 'category', type: 'text' },
                { name: 'jobName', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'price', type: 'number', min: 0 },
                { name: 'monthlyFee', type: 'number', min: 0 },
                { name: 'startDate', type: 'date' },
                { name: 'endDate', type: 'date' },
              ],
            },
          ],
        },
        {
          label: 'Social Proof',
          fields: [
            {
              name: 'teamMembers',
              type: 'array',
              admin: { description: 'Optional team list for this portfolio item.' },
              fields: [
                { name: 'name', type: 'text' },
                { name: 'role', type: 'text' },
                { name: 'email', type: 'email' },
              ],
            },
            {
              name: 'testimonial',
              type: 'group',
              admin: { description: 'Optional testimonial.' },
              fields: [
                { name: 'name', type: 'text' },
                { name: 'message', type: 'textarea' },
                { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              fields: [
                { name: 'metaTitle', type: 'text' },
                { name: 'metaDescription', type: 'textarea' },
                { name: 'metaImage', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Automatic if left blank',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (value) return slugify(value, { lower: true, strict: true })
            if (data?.title) return slugify(data.title, { lower: true, strict: true })
            return value
          },
        ],
      },
    },
    {
      name: 'clientStatus',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Complete', value: 'complete' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', type: 'date', admin: { hidden: true } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'isFeaturedOnHomepage', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { hidden: true } },
  ],
  timestamps: true,
}
