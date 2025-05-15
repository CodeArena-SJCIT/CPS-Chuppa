"use client"

import { FacultyFormWrapper } from "@/components/faculty-form/form-wrapper"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function FacultyDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session.user.role !== "faculty") {
      router.push("/dashboard")
    }
  }, [session, status, router])

  if (status !== "authenticated" || !session) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <FacultyFormWrapper />
}
