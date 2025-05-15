"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Loader2, Send } from "lucide-react"
import type {
  ResearchSection,
  AdministrationSection,
  AcademicsSection,
  IndustryInteractionSection,
  PlacementActivitiesSection,
} from "@/lib/types"

interface FormSummaryProps {
  research: ResearchSection
  administration: AdministrationSection
  academics: AcademicsSection
  industryInteraction: IndustryInteractionSection
  placementActivities: PlacementActivitiesSection
  totalPoints: number
  onPrevious: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function FormSummary({
  research,
  administration,
  academics,
  industryInteraction,
  placementActivities,
  totalPoints,
  onPrevious,
  onSubmit,
  isSubmitting,
}: FormSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="text-lg font-semibold">
          Total Points: <span className="text-primary">{totalPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Research & Publications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Sponsored Projects:</span>
              <span>{research.sponsoredProjects.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Patents:</span>
              <span>{research.patents.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Consultancy Projects:</span>
              <span>{research.consultancyProjects.length}</span>
            </div>
            <div className="flex justify-between">
              <span>PhD Scholars:</span>
              <span>{research.phdScholars.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Journal Papers:</span>
              <span>{research.journalPapers.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Conference Papers:</span>
              <span>{research.conferencePapers.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Conferences Organized:</span>
              <span>{research.conferencesOrganized.length}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Research Points:</span>
              <span>{research.totalPoints}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Administrative Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Administrative Roles:</span>
              <span>{administration.administrativeRoles.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Committee Roles:</span>
              <span>{administration.committeeRoles.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Departmental Activities:</span>
              <span>{administration.departmentalActivities.length}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Administration Points:</span>
              <span>{administration.totalPoints}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Workshops/FDPs:</span>
              <span>{academics.workshops.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Certifications:</span>
              <span>{academics.certifications.length}</span>
            </div>
            <div className="flex justify-between">
              <span>New Labs:</span>
              <span>{academics.newLabs.length}</span>
            </div>
            <div className="flex justify-between">
              <span>PG Dissertations:</span>
              <span>{academics.pgDissertations.length}</span>
            </div>
            <div className="flex justify-between">
              <span>UG Projects:</span>
              <span>{academics.ugProjects.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Books Published:</span>
              <span>{academics.booksPublished.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Faculty Appraisal Entries:</span>
              <span>{academics.facultyAppraisal.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Subject Result Entries:</span>
              <span>{academics.subjectResults.length}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total Academics Points:</span>
              <span>{academics.totalPoints}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry & Placement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Industry Interaction</h3>
              <div className="flex justify-between">
                <span>Industry Attachments:</span>
                <span>{industryInteraction.industryAttachments.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Industry Projects:</span>
                <span>{industryInteraction.industryProjects.length}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Industry Points:</span>
                <span>{industryInteraction.totalPoints}</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">Placement Activities</h3>
              <div className="flex justify-between">
                <span>Placement Percentage Entries:</span>
                <span>{placementActivities.placementPercentage.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Placement Assistance Entries:</span>
                <span>{placementActivities.placementAssistance.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Startup Mentoring Entries:</span>
                <span>{placementActivities.startupMentoring.length}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Placement Points:</span>
                <span>{placementActivities.totalPoints}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total CPS Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Research</div>
              <div className="text-xl font-bold">{research.totalPoints}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Administration</div>
              <div className="text-xl font-bold">{administration.totalPoints}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Academics</div>
              <div className="text-xl font-bold">{academics.totalPoints}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Industry</div>
              <div className="text-xl font-bold">{industryInteraction.totalPoints}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Placement</div>
              <div className="text-xl font-bold">{placementActivities.totalPoints}</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Total Points</div>
            <div className="text-2xl font-bold text-primary">{totalPoints}</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Section
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Submit CPS Form
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
