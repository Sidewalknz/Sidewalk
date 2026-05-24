import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    // Only admins can delete users
    delete: ({ req: { user } }) => {
        if (!user) return false;
        const roles = user.role || user.roles || [];
        return Array.isArray(roles) ? roles.includes('admin') : roles === 'admin';
    },
    // Only admins can update other users (self-update is handled by Payload auth)
    update: ({ req: { user } }) => {
        if (!user) return false;
        const roles = user.role || user.roles || [];
        return Array.isArray(roles) ? roles.includes('admin') : roles === 'admin';
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      access: {
        update: ({ req: { user } }) => {
            if (!user) return false;
            const roles = user.role || user.roles || [];
            return Array.isArray(roles) ? roles.includes('admin') : roles === 'admin';
        },
      },
    },
    {
        name: 'status',
        type: 'select',
        required: true,
        defaultValue: 'active',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Suspended', value: 'suspended' },
        ],
        admin: {
            position: 'sidebar',
        }
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'e.g. Home, Work',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'shipping',
          options: [
            { label: 'Shipping', value: 'shipping' },
            { label: 'Billing', value: 'billing' },
            { label: 'Both', value: 'both' },
          ],
        },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text' },
        { name: 'postalCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this user',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
};
