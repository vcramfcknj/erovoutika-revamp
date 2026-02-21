'use client'

import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const isLoginRoute = pathname === '/login'

  // Don't show header/footer on admin or login pages
  if (isAdminRoute || isLoginRoute) {
    return <>{children}</>
  }

  // Public pages show header and footer
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}