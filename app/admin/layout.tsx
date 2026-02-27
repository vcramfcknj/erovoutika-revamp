'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  Newspaper, 
  Award, 
  Users, 
  Mail, 
  LogOut,
  Menu,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const navigation = [
  { name: 'Dashboard',         href: '/admin',           icon: LayoutDashboard },
  { name: 'News & Updates',    href: '/admin/news',      icon: Newspaper },
  { name: 'Awards',            href: '/admin/awards',    icon: Award },
  { name: 'Partners',          href: '/admin/partners',  icon: Users },
  { name: 'Contact Messages',  href: '/admin/messages',  icon: Mail },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [isLoading,        setIsLoading]        = useState(true)
  const [isSidebarOpen,    setIsSidebarOpen]    = useState(false)
  const [userEmail,        setUserEmail]        = useState<string | null>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/'); return }
      setUserEmail(session.user.email || null)
      setIsLoading(false)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = '/'
    })
    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    setShowLogoutDialog(false)
    try { await supabase.auth.signOut() } catch (e) { console.error('Logout error:', e) }
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 dark:text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 shadow-2xl
        bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        border-r border-gray-200 dark:border-slate-700/50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/50">
            <Image
              src="/erovoutika-logo.png"
              alt="Erovoutika"
              width={140}
              height={45}
              className="h-20 w-auto dark:brightness-0 dark:invert"
            />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon     = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 bg-white rounded-full shrink-0 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-900/50">
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="outline"
              className="w-full justify-center text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950 dark:hover:text-red-300 dark:hover:border-red-800 dark:bg-slate-800/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72 min-h-screen bg-gray-50 dark:bg-[#050A14] transition-colors duration-200">

        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700/60 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between h-full px-6">

            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 rounded-lg transition-colors text-gray-600 dark:text-slate-400"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden lg:block" />

            {/* Right side: theme toggle + user */}
            <div className="flex items-center gap-3 ml-auto">

              {/* Theme toggle */}
              <ThemeToggle />

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userEmail?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Admin</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-[150px]">{userEmail}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 dark:bg-slate-800 dark:border-slate-700">
                  <DropdownMenuLabel>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Logged in as</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:border-slate-700" />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Logout dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-slate-100">Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              You will be redirected to the homepage and need to login again to access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}