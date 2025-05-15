"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResearchForm } from "./research-form"
import { AdministrationForm } from "./administration-form"
import { AcademicsForm } from "./academics-form"
import { IndustryForm } from "./industry-form"
import { PlacementForm } from "./placement-form"
import { FormSummary } from "./form-summary"
import { calculateTotalPoints } from "@/lib/point-calculator"
import type {
  ResearchSection,
  AdministrationSection,
  AcademicsSection,
  IndustryInteractionSection,
  PlacementActivitiesSection,
  FormSubmission,
} from "@/lib/types"
import { Loader2, Save, Send, AlertTriangle } from "lucide-react"

// Initial state for form sections
const initialResearch: ResearchSection = {
  sponsoredProjects: [],
  patents: [],
  consultancyProjects: [],
  phdScholars: [],
  journalPapers: [],
  conferencePapers: [],
  conferencesOrganized: [],
  totalPoints: 0,
}

const initialAdministration: AdministrationSection = {
  administrativeRoles: [],
  committeeRoles: [],
  departmentalActivities: [],
  totalPoints: 0,
}

const initialAcademics: AcademicsSection = {
  workshops: [],
  certifications: [],
  newLabs: [],
  pgDissertations: [],
  ugProjects: [],
  booksPublished: [],
  facultyAppraisal: [],
  subjectResults: [],
  totalPoints: 0,
}

const initialIndustryInteraction: IndustryInteractionSection = {
  industryAttachments: [],
  industryProjects: [],
  totalPoints: 0,
}

const initialPlacementActivities: PlacementActivitiesSection = {
  placementPercentage: [],
  placementAssistance: [],
  startupMentoring: [],
  totalPoints: 0,
}

export function FacultyFormWrapper() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("research")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState("")
  const [formId, setFormId] = useState<string | null>(null)
  const [mongoConnected, setMongoConnected] = useState<boolean | null>(null)

  const [research, setResearch] = useState<ResearchSection>(initialResearch)
  const [administration, setAdministration] = useState<AdministrationSection>(initialAdministration)
  const [academics, setAcademics] = useState<AcademicsSection>(initialAcademics)
  const [industryInteraction, setIndustryInteraction] = useState<IndustryInteractionSection>(initialIndustryInteraction)
  const [placementActivities, setPlacementActivities] = useState<PlacementActivitiesSection>(initialPlacementActivities)
  const [academicYear, setAcademicYear] = useState(`${new Date().getFullYear() - 1}-${new Date().getFullYear()}`)

  // Check MongoDB connection
  useEffect(() => {
    async function checkMongoConnection() {
      try {
        const response = await fetch("/api/check-mongo")
        const data = await response.json()
        setMongoConnected(data.connected)

        if (data.connected) {
          // Try to load draft if MongoDB is connected
          loadDraft()
        }
      } catch (error) {
        console.error("Error checking MongoDB connection:", error)
        setMongoConnected(false)
      }
    }

    checkMongoConnection()
  }, [])

  // Calculate total points whenever any section changes
  const totalPoints = calculateTotalPoints(
    research,
    administration,
    academics,
    industryInteraction,
    placementActivities,
  )

  // Load existing draft if available
  async function loadDraft() {
    try {
      const response = await fetch("/api/submissions/draft")
      if (response.ok) {
        const data = await response.json()
        if (data && data.id) {
          setFormId(data.id)
          setAcademicYear(data.academicYear)
          setResearch(data.research)
          setAdministration(data.administration)
          setAcademics(data.academics)
          setIndustryInteraction(data.industryInteraction)
          setPlacementActivities(data.placementActivities)
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error)
    }
  }

  // Submit form to the server
  const handleSubmit = async (asDraft = false) => {
    try {
      if (asDraft) {
        setIsSaving(true)
      } else {
        setIsSubmitting(true)
      }
      setFormError("")

      const formData: Partial<FormSubmission> = {
        academicYear,
        status: asDraft ? "draft" : "pending",
        totalPoints,
        research,
        administration,
        academics,
        industryInteraction,
        placementActivities,
      }

      if (formId) {
        formData.id = formId
      }

      if (mongoConnected) {
        // If MongoDB is connected, send to API
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "An error occurred while submitting the form")
        }

        if (data.submissionId) {
          setFormId(data.submissionId)
        }
      } else {
        // If MongoDB is not connected, just simulate success
        // In a real app, you might want to store in localStorage
        console.log("MongoDB not connected, simulating form submission:", formData)

        // Generate a fake ID if needed
        if (!formId) {
          setFormId(`temp-${Date.now()}`)
        }
      }

      if (!asDraft) {
        setSubmitted(true)
        setTimeout(() => {
          router.push("/dashboard/faculty/history")
          router.refresh()
        }, 2000)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
      setIsSaving(false)
    }
  }

  if (submitted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Submission Successful</CardTitle>
          <CardDescription>
            Your CPS form has been submitted successfully. You will be redirected to your history page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50">
            <AlertTitle>Form Submitted</AlertTitle>
            <AlertDescription>
              Your CPS form for {academicYear} has been submitted successfully. It is now pending approval from the HOD.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {mongoConnected === false && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            MongoDB is not connected. Form data will not be saved to the database. Please contact your administrator.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Faculty Career Progression Scheme</h1>
          <p className="text-muted-foreground">Academic Year: {academicYear}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSaving || isSubmitting}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={isSaving || isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit Form
          </Button>
        </div>
      </div>

      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full">
        <Tabs defaultValue="research" value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <CardTitle>CPS Form Sections</CardTitle>
                <div className="text-lg font-semibold">
                  Total Points: <span className="text-primary">{totalPoints}</span>
                </div>
              </div>
              <TabsList className="grid grid-cols-2 md:grid-cols-6">
                <TabsTrigger value="research">Research</TabsTrigger>
                <TabsTrigger value="administration">Administration</TabsTrigger>
                <TabsTrigger value="academics">Academics</TabsTrigger>
                <TabsTrigger value="industry">Industry</TabsTrigger>
                <TabsTrigger value="placement">Placement</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <TabsContent value="research">
              <ResearchForm
                research={research}
                setResearch={setResearch}
                onNext={() => setActiveTab("administration")}
              />
            </TabsContent>
            <TabsContent value="administration">
              <AdministrationForm
                administration={administration}
                setAdministration={setAdministration}
                onNext={() => setActiveTab("academics")}
                onPrevious={() => setActiveTab("research")}
              />
            </TabsContent>
            <TabsContent value="academics">
              <AcademicsForm
                academics={academics}
                setAcademics={setAcademics}
                onNext={() => setActiveTab("industry")}
                onPrevious={() => setActiveTab("administration")}
              />
            </TabsContent>
            <TabsContent value="industry">
              <IndustryForm
                industryInteraction={industryInteraction}
                setIndustryInteraction={setIndustryInteraction}
                onNext={() => setActiveTab("placement")}
                onPrevious={() => setActiveTab("academics")}
              />
            </TabsContent>
            <TabsContent value="placement">
              <PlacementForm
                placementActivities={placementActivities}
                setPlacementActivities={setPlacementActivities}
                onNext={() => setActiveTab("summary")}
                onPrevious={() => setActiveTab("industry")}
              />
            </TabsContent>
            <TabsContent value="summary">
              <FormSummary
                research={research}
                administration={administration}
                academics={academics}
                industryInteraction={industryInteraction}
                placementActivities={placementActivities}
                totalPoints={totalPoints}
                onPrevious={() => setActiveTab("placement")}
                onSubmit={() => handleSubmit(false)}
                isSubmitting={isSubmitting}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
