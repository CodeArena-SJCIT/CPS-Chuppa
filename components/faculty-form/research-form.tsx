"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import type { ResearchSection, SponsoredProject, Patent, JournalPaper, ConferencePaper } from "@/lib/types"
import {
  calculateResearchPoints,
  calculateSponsoredProjectPoints,
  calculatePatentPoints,
  calculateJournalPaperPoints,
  calculateConferencePaperPoints,
} from "@/lib/point-calculator"

interface ResearchFormProps {
  research: ResearchSection
  setResearch: (research: ResearchSection) => void
  onNext: () => void
}

export function ResearchForm({ research, setResearch, onNext }: ResearchFormProps) {
  // State for sponsored projects
  const [hasSponsoredProjects, setHasSponsoredProjects] = useState<string>("no")
  const [sponsoredProjectCount, setSponsoredProjectCount] = useState<number>(0)

  // State for patents
  const [hasPatents, setHasPatents] = useState<string>("no")
  const [patentCount, setPatentCount] = useState<number>(0)

  // State for journal papers
  const [hasJournalPapers, setHasJournalPapers] = useState<string>("no")
  const [journalPaperCount, setJournalPaperCount] = useState<number>(0)

  // State for conference papers
  const [hasConferencePapers, setHasConferencePapers] = useState<string>("no")
  const [conferencePaperCount, setConferencePaperCount] = useState<number>(0)

  // Initialize form state from existing data
  useEffect(() => {
    if (research.sponsoredProjects.length > 0) {
      setHasSponsoredProjects("yes")
      setSponsoredProjectCount(research.sponsoredProjects.length)
    }

    if (research.patents.length > 0) {
      setHasPatents("yes")
      setPatentCount(research.patents.length)
    }

    if (research.journalPapers.length > 0) {
      setHasJournalPapers("yes")
      setJournalPaperCount(research.journalPapers.length)
    }

    if (research.conferencePapers.length > 0) {
      setHasConferencePapers("yes")
      setConferencePaperCount(research.conferencePapers.length)
    }
  }, [research])

  // Handle sponsored projects count change
  const handleSponsoredProjectCountChange = (count: number) => {
    setSponsoredProjectCount(count)

    const currentProjects = [...research.sponsoredProjects]

    if (count > currentProjects.length) {
      // Add new empty projects
      const newProjects = Array(count - currentProjects.length)
        .fill(null)
        .map(
          () =>
            ({
              title: "",
              fundingAgency: "",
              fundingAmount: 0,
              startDate: "",
              endDate: "",
              status: "ongoing",
              investigators: [],
              calculatedPoints: 0,
            }) as SponsoredProject,
        )

      const updatedResearch = {
        ...research,
        sponsoredProjects: [...currentProjects, ...newProjects],
      }

      updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
      setResearch(updatedResearch)
    } else if (count < currentProjects.length) {
      // Remove excess projects
      const updatedResearch = {
        ...research,
        sponsoredProjects: currentProjects.slice(0, count),
      }

      updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
      setResearch(updatedResearch)
    }
  }

  // Handle patents count change
  const handlePatentCountChange = (count: number) => {
    setPatentCount(count)

    const currentPatents = [...research.patents]

    if (count > currentPatents.length) {
      // Add new empty patents
      const newPatents = Array(count - currentPatents.length)
        .fill(null)
        .map(
          () =>
            ({
              title: "",
              applicationNumber: "",
              filingDate: "",
              status: "filed",
              inventors: [],
              calculatedPoints: 0,
            }) as Patent,
        )

      const updatedResearch = {
        ...research,
        patents: [...currentPatents, ...newPatents],
      }

      updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
      setResearch(updatedResearch)
    } else if (count < currentPatents.length) {
      // Remove excess patents
      const updatedResearch = {
        ...research,
        patents: currentPatents.slice(0, count),
      }

      updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
      setResearch(updatedResearch)
    }
  }

  // Handle journal papers count change
  const handleJournalPaperCountChange = (count: number) => {
    setJournalPaperCount(count)

    const currentPapers = [...research.journalPapers]

    if (count > currentPapers.length) {
      // Add new empty papers
      const newPapers = Array(count - currentPapers.length)
        .fill(null)
        .map(
          () =>
            ({
              title: "",
              journal: "",
              indexing: "SCI",
              publicationDate: "",
              authors: [],
              calculatedPoints: 0,
            }) as JournalPaper,
        )

      const updatedResearch = {
        ...research,
        journalPapers: [...currentPapers, ...newPapers],
      }

      updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
      setResearch(updatedResearch)
    } else if (count < currentPapers.length) {
      // Remove excess papers
      const updatedResearch = {
        ...research,
        journalPapers: currentPapers.slice(0, count),
      }

      updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
      setResearch(updatedResearch)
    }
  }

  // Handle conference papers count change
  const handleConferencePaperCountChange = (count: number) => {
    setConferencePaperCount(count)

    const currentPapers = [...research.conferencePapers]

    if (count > currentPapers.length) {
      // Add new empty papers
      const newPapers = Array(count - currentPapers.length)
        .fill(null)
        .map(
          () =>
            ({
              title: "",
              conference: "",
              indexing: "SCI",
              presentationDate: "",
              authors: [],
              calculatedPoints: 0,
            }) as ConferencePaper,
        )

      const updatedResearch = {
        ...research,
        conferencePapers: [...currentPapers, ...newPapers],
      }

      updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
      setResearch(updatedResearch)
    } else if (count < currentPapers.length) {
      // Remove excess papers
      const updatedResearch = {
        ...research,
        conferencePapers: currentPapers.slice(0, count),
      }

      updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
      setResearch(updatedResearch)
    }
  }

  // Update sponsored project field
  const updateSponsoredProject = (index: number, field: keyof SponsoredProject, value: any) => {
    const updatedProjects = [...research.sponsoredProjects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }

    // Update calculated points based on funding amount and investigators
    if (field === "fundingAmount" || field === "investigators") {
      updatedProjects[index].calculatedPoints = calculateSponsoredProjectPoints(updatedProjects[index])
    }

    const updatedResearch = {
      ...research,
      sponsoredProjects: updatedProjects,
    }

    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
    setResearch(updatedResearch)
  }

  // Update patent field
  const updatePatent = (index: number, field: keyof Patent, value: any) => {
    const updatedPatents = [...research.patents]
    updatedPatents[index] = {
      ...updatedPatents[index],
      [field]: value,
    }

    // Update calculated points based on status and inventors
    if (field === "status" || field === "inventors") {
      updatedPatents[index].calculatedPoints = calculatePatentPoints(updatedPatents[index])
    }

    const updatedResearch = {
      ...research,
      patents: updatedPatents,
    }

    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
    setResearch(updatedResearch)
  }

  // Update journal paper field
  const updateJournalPaper = (index: number, field: keyof JournalPaper, value: any) => {
    const updatedPapers = [...research.journalPapers]
    updatedPapers[index] = {
      ...updatedPapers[index],
      [field]: value,
    }

    // Update calculated points based on indexing and authors
    if (field === "indexing" || field === "authors") {
      updatedPapers[index].calculatedPoints = calculateJournalPaperPoints(updatedPapers[index])
    }

    const updatedResearch = {
      ...research,
      journalPapers: updatedPapers,
    }

    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
    setResearch(updatedResearch)
  }

  // Update conference paper field
  const updateConferencePaper = (index: number, field: keyof ConferencePaper, value: any) => {
    const updatedPapers = [...research.conferencePapers]
    updatedPapers[index] = {
      ...updatedPapers[index],
      [field]: value,
    }

    // Update calculated points based on indexing and authors
    if (field === "indexing" || field === "authors") {
      updatedPapers[index].calculatedPoints = calculateConferencePaperPoints(updatedPapers[index])
    }

    const updatedResearch = {
      ...research,
      conferencePapers: updatedPapers,
    }

    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)
    setResearch(updatedResearch)
  }

  const [activeDialog, setActiveDialog] = useState<string | null>(null)

  // Sponsored Projects
  const [newProject, setNewProject] = useState<Partial<SponsoredProject>>({
    title: "",
    fundingAgency: "",
    fundingAmount: 0,
    startDate: "",
    endDate: "",
    status: "ongoing",
    investigators: [],
    calculatedPoints: 0,
  })

  // Patents
  const [newPatent, setNewPatent] = useState<Partial<Patent>>({
    title: "",
    applicationNumber: "",
    filingDate: "",
    status: "filed",
    inventors: [],
    calculatedPoints: 0,
  })

  // Journal Papers
  const [newJournalPaper, setNewJournalPaper] = useState<Partial<JournalPaper>>({
    title: "",
    journal: "",
    indexing: "SCI",
    publicationDate: "",
    authors: [],
    calculatedPoints: 0,
  })

  // Conference Papers
  const [newConferencePaper, setNewConferencePaper] = useState<Partial<ConferencePaper>>({
    title: "",
    conference: "",
    indexing: "SCI",
    presentationDate: "",
    authors: [],
    calculatedPoints: 0,
  })

  // Add sponsored project
  const addSponsoredProject = () => {
    if (!newProject.title || !newProject.fundingAgency) return

    const updatedProjects = [
      ...research.sponsoredProjects,
      {
        ...newProject,
        title: newProject.title || "",
        fundingAgency: newProject.fundingAgency || "",
        fundingAmount: newProject.fundingAmount || 0,
        startDate: newProject.startDate || new Date().toISOString().split("T")[0],
        endDate: newProject.endDate || new Date().toISOString().split("T")[0],
        status: (newProject.status as "ongoing" | "completed") || "ongoing",
        investigators: newProject.investigators || [],
        calculatedPoints: newProject.calculatedPoints || 0,
      } as SponsoredProject,
    ]

    const updatedResearch = {
      ...research,
      sponsoredProjects: updatedProjects,
    }

    // Recalculate total points
    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)

    setResearch(updatedResearch)
    setNewProject({
      title: "",
      fundingAgency: "",
      fundingAmount: 0,
      startDate: "",
      endDate: "",
      status: "ongoing",
      investigators: [],
      calculatedPoints: 0,
    })
    setActiveDialog(null)
  }

  // Add patent
  const addPatent = () => {
    if (!newPatent.title || !newPatent.applicationNumber) return

    const updatedPatents = [
      ...research.patents,
      {
        ...newPatent,
        title: newPatent.title || "",
        applicationNumber: newPatent.applicationNumber || "",
        filingDate: newPatent.filingDate || new Date().toISOString().split("T")[0],
        status: (newPatent.status as "filed" | "published" | "granted") || "filed",
        inventors: newPatent.inventors || [],
        calculatedPoints: newPatent.calculatedPoints || 0,
      } as Patent,
    ]

    const updatedResearch = {
      ...research,
      patents: updatedPatents,
    }

    // Recalculate total points
    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)

    setResearch(updatedResearch)
    setNewPatent({
      title: "",
      applicationNumber: "",
      filingDate: "",
      status: "filed",
      inventors: [],
      calculatedPoints: 0,
    })
    setActiveDialog(null)
  }

  // Add journal paper
  const addJournalPaper = () => {
    if (!newJournalPaper.title || !newJournalPaper.journal) return

    const updatedJournalPapers = [
      ...research.journalPapers,
      {
        ...newJournalPaper,
        title: newJournalPaper.title || "",
        journal: newJournalPaper.journal || "",
        indexing: (newJournalPaper.indexing as "SCI" | "Scopus" | "Other") || "SCI",
        publicationDate: newJournalPaper.publicationDate || new Date().toISOString().split("T")[0],
        authors: newJournalPaper.authors || [],
        calculatedPoints: newJournalPaper.calculatedPoints || 0,
      } as JournalPaper,
    ]

    const updatedResearch = {
      ...research,
      journalPapers: updatedJournalPapers,
    }

    // Recalculate total points
    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)

    setResearch(updatedResearch)
    setNewJournalPaper({
      title: "",
      journal: "",
      indexing: "SCI",
      publicationDate: "",
      authors: [],
      calculatedPoints: 0,
    })
    setActiveDialog(null)
  }

  // Add conference paper
  const addConferencePaper = () => {
    if (!newConferencePaper.title || !newConferencePaper.conference) return

    const updatedConferencePapers = [
      ...research.conferencePapers,
      {
        ...newConferencePaper,
        title: newConferencePaper.title || "",
        conference: newConferencePaper.conference || "",
        indexing: (newConferencePaper.indexing as "SCI" | "Scopus" | "Web of Science" | "Other") || "SCI",
        presentationDate: newConferencePaper.presentationDate || new Date().toISOString().split("T")[0],
        authors: newConferencePaper.authors || [],
        calculatedPoints: newConferencePaper.calculatedPoints || 0,
      } as ConferencePaper,
    ]

    const updatedResearch = {
      ...research,
      conferencePapers: updatedConferencePapers,
    }

    // Recalculate total points
    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)

    setResearch(updatedResearch)
    setNewConferencePaper({
      title: "",
      conference: "",
      indexing: "SCI",
      presentationDate: "",
      authors: [],
      calculatedPoints: 0,
    })
    setActiveDialog(null)
  }

  // Remove item from any section
  const removeItem = (section: keyof ResearchSection, index: number) => {
    if (!Array.isArray(research[section])) return

    const updatedItems = [...(research[section] as any[])]
    updatedItems.splice(index, 1)

    const updatedResearch = {
      ...research,
      [section]: updatedItems,
    }

    // Recalculate total points
    updatedResearch.totalPoints = calculateResearchPoints(updatedResearch)

    setResearch(updatedResearch)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Research & Publications</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{research.totalPoints}</span>
        </div>
      </div>

      {/* Externally Funded Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Externally Funded Projects and Patents</CardTitle>
          <CardDescription>Select Options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">Have you done Any Externally Sponsored R&D Projects?</Label>
            <RadioGroup
              value={hasSponsoredProjects}
              onValueChange={(value) => {
                setHasSponsoredProjects(value)
                if (value === "no") {
                  handleSponsoredProjectCountChange(0)
                } else if (sponsoredProjectCount === 0) {
                  handleSponsoredProjectCountChange(1)
                }
              }}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sponsored-projects-yes" />
                <Label htmlFor="sponsored-projects-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sponsored-projects-no" />
                <Label htmlFor="sponsored-projects-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasSponsoredProjects === "yes" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="sponsored-project-count">
                  How many Externally Sponsored R&D Projects Completed / Ongoing
                </Label>
                <Input
                  id="sponsored-project-count"
                  type="number"
                  min={0}
                  value={sponsoredProjectCount}
                  onChange={(e) => handleSponsoredProjectCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              {research.sponsoredProjects.map((project, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Information About Research Project {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                      <Input
                        id={`project-title-${index}`}
                        value={project.title}
                        onChange={(e) => updateSponsoredProject(index, "title", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`funding-agency-${index}`}>Funding Agency</Label>
                      <Input
                        id={`funding-agency-${index}`}
                        value={project.fundingAgency}
                        onChange={(e) => updateSponsoredProject(index, "fundingAgency", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`funding-amount-${index}`}>Select Funding Amount for Project</Label>
                      <Select
                        value={project.fundingAmount.toString()}
                        onValueChange={(value) =>
                          updateSponsoredProject(index, "fundingAmount", Number.parseInt(value))
                        }
                      >
                        <SelectTrigger id={`funding-amount-${index}`} className="mt-2">
                          <SelectValue placeholder="Select funding amount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="25000">₹25,000 - ₹99,999 (1 point)</SelectItem>
                          <SelectItem value="100000">₹1,00,000 - ₹1,99,999 (2 points)</SelectItem>
                          <SelectItem value="200000">₹2,00,000 - ₹4,99,999 (4 points)</SelectItem>
                          <SelectItem value="500000">₹5,00,000 - ₹9,99,999 (6 points)</SelectItem>
                          <SelectItem value="1000000">₹10,00,000 - ₹19,99,999 (8 points)</SelectItem>
                          <SelectItem value="2000000">₹20,00,000 and above (10 points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`project-team-${index}`}>Was the project carried out solo or as a team?</Label>
                      <Select
                        value={project.investigators.length > 0 ? "team" : "solo"}
                        onValueChange={(value) => {
                          if (value === "solo") {
                            updateSponsoredProject(index, "investigators", [])
                          } else {
                            updateSponsoredProject(index, "investigators", [{ name: "", role: "PI" }])
                          }
                        }}
                      >
                        <SelectTrigger id={`project-team-${index}`} className="mt-2">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solo">Solo (100% points)</SelectItem>
                          <SelectItem value="team">Team (PI: 60%, Co-PIs: 40% divided equally)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {project.investigators.length > 0 && (
                      <div>
                        <Label htmlFor={`project-role-${index}`}>Your Role in the Project</Label>
                        <Select
                          value={project.investigators[0]?.role || "PI"}
                          onValueChange={(value) => {
                            const updatedInvestigators = [...project.investigators]
                            updatedInvestigators[0] = { ...updatedInvestigators[0], role: value as "PI" | "Co-PI" }
                            updateSponsoredProject(index, "investigators", updatedInvestigators)
                          }}
                        >
                          <SelectTrigger id={`project-role-${index}`} className="mt-2">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PI">Principal Investigator (60% of points)</SelectItem>
                            <SelectItem value="Co-PI">Co-Principal Investigator (Share of 40%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="p-4 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium">Calculated Points: {project.calculatedPoints}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on funding amount: ₹{project.fundingAmount.toLocaleString()} and your role
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Label className="text-base">Have you published any patents or hold ownership of any patents?</Label>
            <RadioGroup
              value={hasPatents}
              onValueChange={(value) => {
                setHasPatents(value)
                if (value === "no") {
                  handlePatentCountChange(0)
                } else if (patentCount === 0) {
                  handlePatentCountChange(1)
                }
              }}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="patents-yes" />
                <Label htmlFor="patents-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="patents-no" />
                <Label htmlFor="patents-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasPatents === "yes" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="patent-count">How many patents have you published or been granted?</Label>
                <Input
                  id="patent-count"
                  type="number"
                  min={0}
                  value={patentCount}
                  onChange={(e) => handlePatentCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>

              {research.patents.map((patent, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Information About Patent {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`patent-title-${index}`}>Patent Title</Label>
                      <Input
                        id={`patent-title-${index}`}
                        value={patent.title}
                        onChange={(e) => updatePatent(index, "title", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`patent-number-${index}`}>Application Number</Label>
                      <Input
                        id={`patent-number-${index}`}
                        value={patent.applicationNumber}
                        onChange={(e) => updatePatent(index, "applicationNumber", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`patent-status-${index}`}>Is the Patent Granted or Published</Label>
                      <Select value={patent.status} onValueChange={(value) => updatePatent(index, "status", value)}>
                        <SelectTrigger id={`patent-status-${index}`} className="mt-2">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="granted">Granted (10 points)</SelectItem>
                          <SelectItem value="published">Published (5 points)</SelectItem>
                          <SelectItem value="filed">Filed (0 points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`patent-team-${index}`}>Was the Patent carried out solo or as a team?</Label>
                      <Select
                        value={patent.inventors.length > 0 ? "team" : "solo"}
                        onValueChange={(value) => {
                          if (value === "solo") {
                            updatePatent(index, "inventors", [])
                          } else {
                            updatePatent(index, "inventors", [{ name: "", role: "Principal" }])
                          }
                        }}
                      >
                        <SelectTrigger id={`patent-team-${index}`} className="mt-2">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solo">Solo (100% points)</SelectItem>
                          <SelectItem value="team">Team (Principal: 60%, Co-inventors: 40% divided equally)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {patent.inventors.length > 0 && (
                      <div>
                        <Label htmlFor={`patent-role-${index}`}>Your Role in the Patent</Label>
                        <Select
                          value={patent.inventors[0]?.role || "Principal"}
                          onValueChange={(value) => {
                            const updatedInventors = [...patent.inventors]
                            updatedInventors[0] = { ...updatedInventors[0], role: value as "Principal" | "Co-inventor" }
                            updatePatent(index, "inventors", updatedInventors)
                          }}
                        >
                          <SelectTrigger id={`patent-role-${index}`} className="mt-2">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Principal">Principal Inventor (60% of points)</SelectItem>
                            <SelectItem value="Co-inventor">Co-inventor (Share of 40%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="p-4 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium">Calculated Points: {patent.calculatedPoints}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on status: {patent.status} and your role
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Journal Papers */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Papers / Book chapter in SCI / Scopus</CardTitle>
          <CardDescription>Select Options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">Do you have publications in SCI or Scopus-indexed journals?</Label>
            <RadioGroup
              value={hasJournalPapers}
              onValueChange={(value) => {
                setHasJournalPapers(value)
                if (value === "no") {
                  handleJournalPaperCountChange(0)
                } else if (journalPaperCount === 0) {
                  handleJournalPaperCountChange(1)
                }
              }}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="journal-papers-yes" />
                <Label htmlFor="journal-papers-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="journal-papers-no" />
                <Label htmlFor="journal-papers-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasJournalPapers === "yes" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="journal-paper-count">
                  How many journal papers or book chapters published in SCI or Scopus-indexed journals?
                </Label>
                <Input
                  id="journal-paper-count"
                  type="number"
                  min={0}
                  value={journalPaperCount}
                  onChange={(e) => handleJournalPaperCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum 10 credit points total for all journal papers
                </p>
              </div>

              {research.journalPapers.map((paper, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Information About Journal Paper / Book Chapter {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`journal-title-${index}`}>Paper Title</Label>
                      <Input
                        id={`journal-title-${index}`}
                        value={paper.title}
                        onChange={(e) => updateJournalPaper(index, "title", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`journal-name-${index}`}>Journal Name</Label>
                      <Input
                        id={`journal-name-${index}`}
                        value={paper.journal}
                        onChange={(e) => updateJournalPaper(index, "journal", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`journal-indexing-${index}`}>Indexing</Label>
                      <Select
                        value={paper.indexing}
                        onValueChange={(value) => updateJournalPaper(index, "indexing", value)}
                      >
                        <SelectTrigger id={`journal-indexing-${index}`} className="mt-2">
                          <SelectValue placeholder="Select indexing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SCI">SCI (4 points)</SelectItem>
                          <SelectItem value="Scopus">Scopus (4 points)</SelectItem>
                          <SelectItem value="Other">Other (0 points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`journal-team-${index}`}>Were you the first author or co-author?</Label>
                      <Select
                        value={paper.authors.length > 0 ? paper.authors[0].role : "First Author"}
                        onValueChange={(value) => {
                          updateJournalPaper(index, "authors", [
                            { name: "", role: value as "First Author" | "Co-Author" },
                          ])
                        }}
                      >
                        <SelectTrigger id={`journal-team-${index}`} className="mt-2">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First Author">First Author / Main Supervisor (2 points)</SelectItem>
                          <SelectItem value="Co-Author">Co-Author (Share of remaining points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium">Calculated Points: {paper.calculatedPoints}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on indexing: {paper.indexing} and your role: {paper.authors[0]?.role || "First Author"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conference Papers */}
      <Card>
        <CardHeader>
          <CardTitle>
            Conference papers indexed in SCI / Scopus / Web of Science Conference / any internationally renowned
            conference
          </CardTitle>
          <CardDescription>Select Options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">
              Do you have any Conference papers indexed in SCI / Scopus / Web of Science Conference / any
              internationally renowned conference?
            </Label>
            <RadioGroup
              value={hasConferencePapers}
              onValueChange={(value) => {
                setHasConferencePapers(value)
                if (value === "no") {
                  handleConferencePaperCountChange(0)
                } else if (conferencePaperCount === 0) {
                  handleConferencePaperCountChange(1)
                }
              }}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="conference-papers-yes" />
                <Label htmlFor="conference-papers-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="conference-papers-no" />
                <Label htmlFor="conference-papers-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasConferencePapers === "yes" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="conference-paper-count">
                  How many conference papers published in indexed conferences?
                </Label>
                <Input
                  id="conference-paper-count"
                  type="number"
                  min={0}
                  value={conferencePaperCount}
                  onChange={(e) => handleConferencePaperCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum 10 credit points total for all conference papers
                </p>
              </div>

              {research.conferencePapers.map((paper, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Information About Conference Paper {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`conference-title-${index}`}>Paper Title</Label>
                      <Input
                        id={`conference-title-${index}`}
                        value={paper.title}
                        onChange={(e) => updateConferencePaper(index, "title", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`conference-name-${index}`}>Conference Name</Label>
                      <Input
                        id={`conference-name-${index}`}
                        value={paper.conference}
                        onChange={(e) => updateConferencePaper(index, "conference", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`conference-indexing-${index}`}>Indexing</Label>
                      <Select
                        value={paper.indexing}
                        onValueChange={(value) => updateConferencePaper(index, "indexing", value)}
                      >
                        <SelectTrigger id={`conference-indexing-${index}`} className="mt-2">
                          <SelectValue placeholder="Select indexing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SCI">SCI (1 point)</SelectItem>
                          <SelectItem value="Scopus">Scopus (1 point)</SelectItem>
                          <SelectItem value="Web of Science">Web of Science (1 point)</SelectItem>
                          <SelectItem value="Other">Other (0 points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`conference-team-${index}`}>Were you the first author or co-author?</Label>
                      <Select
                        value={paper.authors.length > 0 ? paper.authors[0].role : "First Author"}
                        onValueChange={(value) => {
                          updateConferencePaper(index, "authors", [
                            { name: "", role: value as "First Author" | "Co-Author" },
                          ])
                        }}
                      >
                        <SelectTrigger id={`conference-team-${index}`} className="mt-2">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="First Author">First Author / Main Supervisor (0.6 points)</SelectItem>
                          <SelectItem value="Co-Author">Co-Author (Share of remaining points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium">Calculated Points: {paper.calculatedPoints}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on indexing: {paper.indexing} and your role: {paper.authors[0]?.role || "First Author"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext}>
          Next Section <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
