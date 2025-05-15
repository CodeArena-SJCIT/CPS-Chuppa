"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      // Redirect based on user role
      if (session.user.role === "hod") {
        router.push("/dashboard/hod")
      } else {
        router.push("/dashboard/faculty")
      }
    }
  }, [session, router])

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}
