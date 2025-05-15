"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HODDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session.user.role !== "hod") {
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

  // Mock data for HOD dashboard
  const stats = {
    totalFaculty: 45,
    submittedForms: 38,
    pendingForms: 7,
    averagePoints: 76,
  }

  const departmentPerformance = [
    { category: "Academic", average: 28, max: 35 },
    { category: "Research", average: 22, max: 30 },
    { category: "Development", average: 14, max: 20 },
    { category: "Administrative", average: 12, max: 15 },
  ]

  const topPerformers = [
    { id: 1, name: "Dr. Rajesh Kumar", points: 92, department: "Computer Science" },
    { id: 2, name: "Dr. Priya Sharma", points: 88, department: "Electronics" },
    { id: 3, name: "Prof. Anand Singh", points: 85, department: "Mechanical" },
    { id: 4, name: "Dr. Meera Patel", points: 84, department: "Civil" },
    { id: 5, name: "Prof. Suresh Reddy", points: 82, department: "Information Technology" },
  ]

  const recentSubmissions = [
    { id: 1, name: "Dr. Kavita Gupta", date: "May 8, 2024", status: "Pending" },
    { id: 2, name: "Prof. Ramesh Yadav", date: "May 7, 2024", status: "Pending" },
    { id: 3, name: "Dr. Sanjay Verma", date: "May 6, 2024", status: "Pending" },
    { id: 4, name: "Prof. Neha Singh", date: "May 5, 2024", status: "Approved" },
    { id: 5, name: "Dr. Vikram Patel", date: "May 4, 2024", status: "Approved" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">HOD Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFaculty}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submitted Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submittedForms}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.submittedForms / stats.totalFaculty) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingForms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePoints}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Average points by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentPerformance.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{item.category}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.average} / {item.max}
                    </div>
                  </div>
                  <Progress value={(item.average / item.max) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Faculty Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="top">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="top">Top Performers</TabsTrigger>
                <TabsTrigger value="recent">Recent Submissions</TabsTrigger>
              </TabsList>

              <TabsContent value="top" className="space-y-4 pt-4">
                {topPerformers.map((faculty) => (
                  <div key={faculty.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{faculty.name}</div>
                      <div className="text-sm text-muted-foreground">{faculty.department}</div>
                    </div>
                    <div className="font-bold">{faculty.points} pts</div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="recent" className="space-y-4 pt-4">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{submission.name}</div>
                      <div className="text-sm text-muted-foreground">{submission.date}</div>
                    </div>
                    <Badge variant={submission.status === "Approved" ? "default" : "outline"}>
                      {submission.status}
                    </Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
