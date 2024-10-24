// src/app/layout.tsx

import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Weer App',
  description: 'Een weerapplicatie gebouwd met Next.js en Django',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        {/* Voeg hier meta tags, favicons, etc. toe */}
      </head>
      <body>{children}</body>
    </html>
  )
}