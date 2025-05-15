"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for when MongoDB is not connected
const mockSubmissions = [
  {
    id: "mock-1",
    academicYear: "2023-2024",
    submittedDate: new Date().toISOString(),
    status: "pending",
    totalPoints: 85,
    research: { totalPoints: 30 },
    administration: { totalPoints: 15 },
    academics: { totalPoints: 25 },
    industryInteraction: { totalPoints: 5 },
    placementActivities: { totalPoints: 10 },
  },
]

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mongoConnected, setMongoConnected] = useState<boolean | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // First check MongoDB connection
        const connectionResponse = await fetch("/api/check-mongo")
        const connectionData = await connectionResponse.json()
        setMongoConnected(connectionData.connected)

        if (connectionData.connected) {
          // If connected, fetch real submissions
          const submissionsResponse = await fetch("/api/submissions")
          if (submissionsResponse.ok) {
            const data = await submissionsResponse.json()
            setSubmissions(data)
          } else {
            // If API error, use mock data
            setSubmissions(mockSubmissions)
          }
        } else {
          // If not connected, use mock data
          setSubmissions(mockSubmissions)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setSubmissions(mockSubmissions)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My CPS History</h1>
        <Link href="/dashboard/faculty">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New CPS Form
          </Button>
        </Link>
      </div>

      {mongoConnected === false && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            MongoDB is not connected. Showing mock data. Form submissions will not be saved to the database.
          </AlertDescription>
        </Alert>
      )}

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-semibold mb-2">No Submissions Found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any CPS forms yet. Get started by creating a new form.
              </p>
              <Link href="/dashboard/faculty">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Create New CPS Form
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Academic Year {submission.academicYear}</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(submission.submittedDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={submission.status === "approved" ? "default" : "outline"}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Total Points</h3>
                      <p className="text-2xl font-bold">{submission.totalPoints}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Point Breakdown</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Research & Publications</span>
                        <span className="font-medium">{submission.research.totalPoints} points</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Administrative Duties</span>
                        <span className="font-medium">{submission.administration.totalPoints} points</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Academic Performance</span>
                        <span className="font-medium">{submission.academics.totalPoints} points</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Industry Interaction</span>
                        <span className="font-medium">{submission.industryInteraction.totalPoints} points</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Placement Activities</span>
                        <span className="font-medium">{submission.placementActivities.totalPoints} points</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
