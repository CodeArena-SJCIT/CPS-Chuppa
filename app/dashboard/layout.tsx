"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { School, FileText, BarChart, Users } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      setIsLoading(false)
    }
  }, [status, router])

  if (isLoading && status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <School className="h-6 w-6" />
            <span>College CPS Portal</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">{user && <UserNav user={user} />}</div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-gray-50 hidden md:block">
          <div className="flex flex-col gap-2 p-4">
            {user?.role === "faculty" ? (
              <>
                <Link href="/dashboard/faculty">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-5 w-5" />
                    My CPS Form
                  </Button>
                </Link>
                <Link href="/dashboard/faculty/history">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart className="mr-2 h-5 w-5" />
                    My History
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard/hod">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart className="mr-2 h-5 w-5" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/hod/submissions">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-5 w-5" />
                    All Submissions
                  </Button>
                </Link>
                <Link href="/dashboard/hod/users">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-5 w-5" />
                    Manage Users
                  </Button>
                </Link>
              </>
            )}
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
