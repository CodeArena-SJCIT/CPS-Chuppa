"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Search, FileText, Download, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import jsPDF from "jspdf"
import "jspdf-autotable"

interface SubmissionsTableProps {
  submissions: any[]
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.user?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.academicYear?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApprove = async (id: string) => {
    try {
      setIsApproving(true)
      setError("")
      setSuccessMessage("")

      const response = await fetch(`/api/submissions/${id}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to approve submission")
      }

      setSuccessMessage("Submission approved successfully")

      // Wait a moment before closing the dialog
      setTimeout(() => {
        setSelectedSubmission(null)
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Error approving submission:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsApproving(false)
    }
  }

  const generatePDF = (submission: any) => {
    try {
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(18)
      doc.text("Faculty Career Progression Scheme Form", 105, 15, { align: "center" })

      // Add faculty details
      doc.setFontSize(12)
      doc.text(`Faculty Name: ${submission.user?.name || "N/A"}`, 20, 30)
      doc.text(`Department: ${submission.user?.department || "N/A"}`, 20, 37)
      doc.text(`Academic Year: ${submission.academicYear || "N/A"}`, 20, 44)
      doc.text(`Submission Date: ${new Date(submission.submittedDate).toLocaleDateString()}`, 20, 51)
      doc.text(`Status: ${submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}`, 20, 58)
      doc.text(`Total Points: ${submission.totalPoints}`, 20, 65)

      // Add section points
      doc.setFontSize(14)
      doc.text("Points Breakdown", 105, 80, { align: "center" })

      // Create table for points
      const tableData = [
        ["Section", "Points"],
        ["Research & Publications", submission.research?.totalPoints || 0],
        ["Administrative Duties", submission.administration?.totalPoints || 0],
        ["Academic Performance", submission.academics?.totalPoints || 0],
        ["Industry Interaction", submission.industryInteraction?.totalPoints || 0],
        ["Placement Activities", submission.placementActivities?.totalPoints || 0],
        ["Total", submission.totalPoints || 0],
      ]

      // @ts-ignore - jsPDF-AutoTable types are not properly recognized
      doc.autoTable({
        startY: 85,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { halign: "center" },
        columnStyles: {
          0: { halign: "left" },
        },
      })

      // Add detailed section information
      let yPos = doc.autoTable.previous.finalY + 20

      // Research section details
      if (submission.research) {
        doc.setFontSize(14)
        doc.text("Research & Publications Details", 20, yPos)
        yPos += 10

        doc.setFontSize(10)

        // Sponsored Projects
        if (submission.research.sponsoredProjects?.length > 0) {
          doc.text(`Externally Funded Projects: ${submission.research.sponsoredProjects.length}`, 20, yPos)
          yPos += 5

          submission.research.sponsoredProjects.forEach((project: any, index: number) => {
            doc.text(
              `  ${index + 1}. ${project.title || "Untitled"} - ₹${project.fundingAmount?.toLocaleString() || "0"}`,
              25,
              yPos,
            )
            yPos += 5
            if (project.fundingAgency) {
              doc.text(`     Agency: ${project.fundingAgency}`, 25, yPos)
              yPos += 5
            }
            doc.text(`     Status: ${project.status} - Points: ${project.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        // Patents
        if (submission.research.patents?.length > 0) {
          doc.text(`Patents: ${submission.research.patents.length}`, 20, yPos)
          yPos += 5

          submission.research.patents.forEach((patent: any, index: number) => {
            doc.text(`  ${index + 1}. ${patent.title || "Untitled"} - ${patent.status}`, 25, yPos)
            yPos += 5
            if (patent.applicationNumber) {
              doc.text(`     Application Number: ${patent.applicationNumber}`, 25, yPos)
              yPos += 5
            }
            doc.text(`     Points: ${patent.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        // Journal Papers
        if (submission.research.journalPapers?.length > 0) {
          doc.text(`Journal Papers: ${submission.research.journalPapers.length}`, 20, yPos)
          yPos += 5

          submission.research.journalPapers.forEach((paper: any, index: number) => {
            doc.text(`  ${index + 1}. ${paper.title || "Untitled"} - ${paper.journal || ""}`, 25, yPos)
            yPos += 5
            doc.text(`     Indexing: ${paper.indexing} - Points: ${paper.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        // Conference Papers
        if (submission.research.conferencePapers?.length > 0) {
          doc.text(`Conference Papers: ${submission.research.conferencePapers.length}`, 20, yPos)
          yPos += 5

          submission.research.conferencePapers.forEach((paper: any, index: number) => {
            doc.text(`  ${index + 1}. ${paper.title || "Untitled"} - ${paper.conference || ""}`, 25, yPos)
            yPos += 5
            doc.text(`     Indexing: ${paper.indexing} - Points: ${paper.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        yPos += 10
      }

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      // Administration section details
      if (submission.administration) {
        doc.setFontSize(14)
        doc.text("Administrative Responsibilities Details", 20, yPos)
        yPos += 10

        doc.setFontSize(10)

        // Administrative Roles
        if (submission.administration.administrativeRoles?.length > 0) {
          doc.text(`Administrative Positions: ${submission.administration.administrativeRoles.length}`, 20, yPos)
          yPos += 5

          submission.administration.administrativeRoles.forEach((role: any, index: number) => {
            doc.text(`  ${index + 1}. ${role.role || "Untitled"}`, 25, yPos)
            yPos += 5
            if (role.startDate && role.endDate) {
              doc.text(
                `     Period: ${new Date(role.startDate).toLocaleDateString()} to ${new Date(role.endDate).toLocaleDateString()}`,
                25,
                yPos,
              )
              yPos += 5
            }
            doc.text(`     Points: ${role.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        // Committee Roles
        if (submission.administration.committeeRoles?.length > 0) {
          doc.text(`Committee Roles: ${submission.administration.committeeRoles.length}`, 20, yPos)
          yPos += 5

          submission.administration.committeeRoles.forEach((role: any, index: number) => {
            doc.text(`  ${index + 1}. ${role.committee || "Untitled"} - ${role.role || ""}`, 25, yPos)
            yPos += 5
            if (role.startDate && role.endDate) {
              doc.text(
                `     Period: ${new Date(role.startDate).toLocaleDateString()} to ${new Date(role.endDate).toLocaleDateString()}`,
                25,
                yPos,
              )
              yPos += 5
            }
            doc.text(`     Points: ${role.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        // Departmental Activities (Conferences)
        const conferenceActivities = submission.administration.departmentalActivities?.filter((activity: any) =>
          activity.activity.toLowerCase().includes("conference"),
        )

        if (conferenceActivities?.length > 0) {
          doc.text(`Conferences Organized: ${conferenceActivities.length}`, 20, yPos)
          yPos += 5

          conferenceActivities.forEach((activity: any, index: number) => {
            doc.text(`  ${index + 1}. ${activity.activity || "Untitled"}`, 25, yPos)
            yPos += 5
            doc.text(`     Role: ${activity.role} - Points: ${activity.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        yPos += 10
      }

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      // Academics section details
      if (submission.academics) {
        doc.setFontSize(14)
        doc.text("Academic Activities Details", 20, yPos)
        yPos += 10

        doc.setFontSize(10)

        // PhD Scholars
        const completedScholars = submission.academics.phdScholars?.filter(
          (scholar: any) => scholar.status === "awarded" || scholar.status === "submitted",
        )

        const pursuingScholars = submission.academics.phdScholars?.filter(
          (scholar: any) => scholar.status === "pursuing",
        )

        if (completedScholars?.length > 0) {
          doc.text(`Completed PhD Scholars: ${completedScholars.length}`, 20, yPos)
          yPos += 5

          completedScholars.forEach((scholar: any, index: number) => {
            doc.text(`  ${index + 1}. ${scholar.name || "Unnamed"} - ${scholar.title || "Untitled"}`, 25, yPos)
            yPos += 5
            doc.text(`     Status: ${scholar.status} - Points: ${scholar.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        if (pursuingScholars?.length > 0) {
          doc.text(`Pursuing PhD Scholars: ${pursuingScholars.length}`, 20, yPos)
          yPos += 5

          pursuingScholars.forEach((scholar: any, index: number) => {
            doc.text(`  ${index + 1}. ${scholar.name || "Unnamed"} - ${scholar.title || "Untitled"}`, 25, yPos)
            yPos += 5
            doc.text(`     Status: ${scholar.status} - Points: ${scholar.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        yPos += 10
      }

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      // Industry Interaction section details
      if (submission.industryInteraction) {
        doc.setFontSize(14)
        doc.text("Industry Interaction Details", 20, yPos)
        yPos += 10

        doc.setFontSize(10)

        // Industry Projects
        if (submission.industryInteraction.industryProjects?.length > 0) {
          doc.text(`Industry Projects: ${submission.industryInteraction.industryProjects.length}`, 20, yPos)
          yPos += 5

          submission.industryInteraction.industryProjects.forEach((project: any, index: number) => {
            doc.text(`  ${index + 1}. ${project.title || "Untitled"} - ${project.company || ""}`, 25, yPos)
            yPos += 5
            doc.text(`     Status: ${project.status} - Points: ${project.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        // Industry Attachments
        if (submission.industryInteraction.industryAttachments?.length > 0) {
          doc.text(`Industry Attachments: ${submission.industryInteraction.industryAttachments.length}`, 20, yPos)
          yPos += 5

          submission.industryInteraction.industryAttachments.forEach((attachment: any, index: number) => {
            doc.text(`  ${index + 1}. ${attachment.company || "Unnamed"}`, 25, yPos)
            yPos += 5
            doc.text(`     Duration: ${attachment.duration} weeks - Points: ${attachment.calculatedPoints}`, 25, yPos)
            yPos += 7
          })
        }

        yPos += 10
      }

      // Save the PDF
      doc.save(`CPS_Form_${submission.user?.name?.replace(/\s+/g, "_") || "Faculty"}_${submission.academicYear}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Submissions Found</h3>
        <p className="text-muted-foreground mb-4">There are no faculty submissions in the system yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, department or academic year..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Faculty Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Academic Year</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No submissions found matching your search.
              </TableCell>
            </TableRow>
          ) : (
            filteredSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.user?.name || "Unknown"}</TableCell>
                <TableCell>{submission.user?.department || "Unknown"}</TableCell>
                <TableCell>{submission.academicYear}</TableCell>
                <TableCell>{new Date(submission.submittedDate).toLocaleDateString()}</TableCell>
                <TableCell>{submission.totalPoints}</TableCell>
                <TableCell>
                  <Badge variant={submission.status === "approved" ? "default" : "outline"}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(submission)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Faculty Details Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Faculty CPS Form Details</DialogTitle>
            <DialogDescription>Reviewing submission for {selectedSubmission?.user?.name}</DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="bg-green-50">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Faculty Name</h3>
                  <p className="font-medium">{selectedSubmission.user?.name || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                  <p className="font-medium">{selectedSubmission.user?.department || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Submitted Date</h3>
                  <p className="font-medium">{new Date(selectedSubmission.submittedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Academic Year</h3>
                  <p className="font-medium">{selectedSubmission.academicYear}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Points</h3>
                  <p className="text-xl font-bold">{selectedSubmission.totalPoints}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge variant={selectedSubmission.status === "approved" ? "default" : "outline"} className="mt-1">
                    {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="breakdown">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="breakdown">Point Breakdown</TabsTrigger>
                  <TabsTrigger value="details">Form Details</TabsTrigger>
                </TabsList>

                <TabsContent value="breakdown" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Research & Publications</span>
                      <span className="font-medium">{selectedSubmission.research?.totalPoints || 0} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Administrative Duties</span>
                      <span className="font-medium">{selectedSubmission.administration?.totalPoints || 0} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Academic Performance</span>
                      <span className="font-medium">{selectedSubmission.academics?.totalPoints || 0} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Industry Interaction</span>
                      <span className="font-medium">
                        {selectedSubmission.industryInteraction?.totalPoints || 0} points
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Placement Activities</span>
                      <span className="font-medium">
                        {selectedSubmission.placementActivities?.totalPoints || 0} points
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Research Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Sponsored Projects: {selectedSubmission.research?.sponsoredProjects?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Patents: {selectedSubmission.research?.patents?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Journal Papers: {selectedSubmission.research?.journalPapers?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Conference Papers: {selectedSubmission.research?.conferencePapers?.length || 0}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Administrative Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Administrative Roles: {selectedSubmission.administration?.administrativeRoles?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Committee Roles: {selectedSubmission.administration?.committeeRoles?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Conferences Organized:{" "}
                        {selectedSubmission.administration?.departmentalActivities?.filter((activity: any) =>
                          activity.activity.toLowerCase().includes("conference"),
                        ).length || 0}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Academic Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed PhD Scholars:{" "}
                        {selectedSubmission.academics?.phdScholars?.filter(
                          (scholar: any) => scholar.status === "awarded" || scholar.status === "submitted",
                        ).length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pursuing PhD Scholars:{" "}
                        {selectedSubmission.academics?.phdScholars?.filter(
                          (scholar: any) => scholar.status === "pursuing",
                        ).length || 0}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Industry Interaction Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Industry Projects: {selectedSubmission.industryInteraction?.industryProjects?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Industry Attachments: {selectedSubmission.industryInteraction?.industryAttachments?.length || 0}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => generatePDF(selectedSubmission)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                {selectedSubmission.status === "pending" && (
                  <Button onClick={() => handleApprove(selectedSubmission.id)} disabled={isApproving}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {isApproving ? "Approving..." : "Approve"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
