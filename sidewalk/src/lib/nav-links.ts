export const frontendNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
]

export const adminNavSections: {
  title: string
  items: { name: string; href: string; icon: string }[]
}[] = [
{
    title: 'Finance',
    items: [
      { name: 'Outgoings', href: '/admin/outgoings', icon: 'ReceiptText' }
    ]
  },
  {
    title: 'Content',
    items: [
      { name: 'Portfolio', href: '/admin/portfolio', icon: 'FolderKanban' }
    ]
  },
]
