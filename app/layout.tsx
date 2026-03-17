import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClearSign - Agent Trust Layer',
  description:
    'Enterprise-grade agent transparency. Four Nemotron agents decompose, assess, manifest, and audit every AI action before execution.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
