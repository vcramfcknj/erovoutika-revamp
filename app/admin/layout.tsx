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
  ChevronDown,
  ChevronRight,
  Building2,
  GraduationCap,
  X
} from 'lucide-react'
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
  { name: 'Dashboard',        href: '/admin',           icon: LayoutDashboard },
  { name: 'News & Updates',   href: '/admin/news',      icon: Newspaper },
  { name: 'Awards',           href: '/admin/awards',    icon: Award },
  { 
    name: 'Partners', 
    href: '/admin/partners', 
    icon: Users,
    subItems: [
      { name: 'All Partners', href: '/admin/partners',          icon: Users },
      { name: 'Industry',     href: '/admin/partners/industry', icon: Building2 },
      { name: 'Academe',      href: '/admin/partners/academe',  icon: GraduationCap },
    ]
  },
  { name: 'Contact Messages', href: '/admin/messages',  icon: Mail },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [isLoading,        setIsLoading]        = useState(true)
  const [isSidebarOpen,    setIsSidebarOpen]    = useState(false)
  const [userEmail,        setUserEmail]        = useState<string | null>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [expandedItems,    setExpandedItems]    = useState<string[]>(['Partners'])

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

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#080d18]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            <div className="absolute inset-[6px] rounded-full border border-orange-500/10 border-b-orange-400 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-400 dark:text-slate-500">Initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Theme-aware CSS for nav items ── */}
      <style>{`
        .nav-item { border-left: 2px solid transparent; transition: all 0.18s ease; }

        /* Light mode hover */
        .nav-item:hover { border-left-color: rgba(249,115,22,0.5); }

        /* Dark mode hover */
        .dark .nav-item:hover {
          background: rgba(249,115,22,0.07);
          border-left-color: rgba(249,115,22,0.4);
          color: #fff;
        }

        /* Active — shared */
        .nav-item-active {
          background: linear-gradient(90deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.04) 100%);
          border-left: 2px solid #f97316;
          color: #f97316;
        }

        /* Light mode active text tweak */
        :not(.dark) .nav-item-active { color: #ea580c; }

        .sub-item-active { color: #f97316; background: rgba(249,115,22,0.08); }
        :not(.dark) .sub-item-active { color: #ea580c; }
      `}</style>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-[264px]
        bg-white dark:bg-[#0a1020]
        border-r border-gray-200 dark:border-white/[0.06]
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Orange left rail */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 0%, #f97316 20%, #f97316 80%, transparent 100%)' }} />

        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="flex items-center justify-between h-[68px] px-5 shrink-0 border-b border-gray-200 dark:border-white/[0.055]">
            <Image
              src="/erovoutika-logo.png"
              alt="Erovoutika"
              width={130} height={40}
              className="h-8 w-auto dark:brightness-0 dark:invert dark:opacity-90"
            />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden w-7 h-7 flex items-center justify-center rounded text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section label */}
          <div className="px-5 pt-6 pb-2">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-gray-400 dark:text-slate-600">Navigation</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-[2px] overflow-y-auto pb-4">
            {navigation.map((item) => {
              const Icon         = item.icon
              const isActive     = pathname === item.href
              const hasSubItems  = item.subItems && item.subItems.length > 0
              const isExpanded   = expandedItems.includes(item.name)
              const isParentActive = hasSubItems && pathname.startsWith(item.href)

              return (
                <div key={item.name}>
                  {hasSubItems ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={`nav-item w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium
                          ${isParentActive
                            ? 'nav-item-active'
                            : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-transparent'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="ml-3 mt-[2px] space-y-[2px] pl-4 border-l border-gray-200 dark:border-white/[0.06]">
                          {item.subItems.map((subItem) => {
                            const SubIcon    = subItem.icon
                            const isSubActive = pathname === subItem.href
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`nav-item flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors
                                  ${isSubActive
                                    ? 'sub-item-active'
                                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-transparent'
                                  }`}
                              >
                                <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                <span>{subItem.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`nav-item flex items-center gap-3 px-3 py-2.5 text-sm font-medium
                        ${isActive
                          ? 'nav-item-active'
                          : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-transparent'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                      )}
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="shrink-0 p-3 border-t border-gray-200 dark:border-white/[0.055]">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium
                text-red-400 dark:text-red-500/70
                hover:text-red-600 dark:hover:text-red-400
                hover:bg-red-50 dark:hover:bg-red-500/8
                hover:border-l-red-400 dark:hover:border-l-red-500/40
                transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="lg:pl-[264px] min-h-screen bg-gray-50 dark:bg-[#080d18] transition-colors duration-200">

        {/* Header */}
        <header className="sticky top-0 z-30 h-[68px] flex items-center justify-between px-6
          bg-white/90 dark:bg-[#080d18]/92
          border-b border-gray-200 dark:border-white/[0.055]
          backdrop-blur-md shadow-sm dark:shadow-none">

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded
              text-gray-500 dark:text-slate-500
              hover:text-orange-500 dark:hover:text-orange-400
              hover:bg-orange-50 dark:hover:bg-orange-500/10
              transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-gray-400 dark:text-slate-600">EVK</span>
            <span className="text-gray-300 dark:text-slate-700">/</span>
            <span className="text-orange-500/80">Admin</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />

            <div className="w-px h-5 bg-gray-200 dark:bg-white/[0.07]" />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 px-3 py-1.5 rounded
                border border-transparent
                hover:border-gray-200 dark:hover:border-white/10
                hover:bg-gray-100 dark:hover:bg-white/[0.04]
                transition-all focus:outline-none group">
                <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xs font-mono">
                    {userEmail?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-gray-800 dark:text-slate-300 leading-none mb-0.5">Admin</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-600 truncate max-w-[130px] font-mono">{userEmail}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 dark:text-slate-600 group-hover:text-gray-600 dark:group-hover:text-slate-400 transition-colors" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52
                bg-white dark:bg-[#0e1525]
                border border-gray-200 dark:border-white/10
                text-gray-700 dark:text-slate-300">
                <DropdownMenuLabel>
                  <p className="text-xs font-mono text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Session</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400 truncate">{userEmail}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/[0.06]" />
                <DropdownMenuItem
                  className="text-red-500 dark:text-red-400 focus:text-red-600 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-950/40 cursor-pointer font-medium text-sm"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Logout dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white dark:bg-[#0e1525] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-slate-100">Confirm logout</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-slate-500 text-sm">
              You will be redirected to the homepage and need to login again to access the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-white/[0.05] border-gray-200 dark:border-white/10 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/[0.09]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white border-0">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}