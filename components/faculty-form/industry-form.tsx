"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, ChevronLeft } from "lucide-react"
import type { IndustryInteractionSection, IndustryAttachment, IndustryProject } from "@/lib/types"
import {
  calculateIndustryInteractionPoints,
  calculateIndustryAttachmentPoints,
  calculateIndustryProjectPoints,
} from "@/lib/point-calculator"

interface IndustryFormProps {
  industryInteraction: IndustryInteractionSection
  setIndustryInteraction: (industryInteraction: IndustryInteractionSection) => void
  onNext: () => void
  onPrevious: () => void
}

export function IndustryForm({ industryInteraction, setIndustryInteraction, onNext, onPrevious }: IndustryFormProps) {
  // State for industry projects
  const [hasIndustryProjects, setHasIndustryProjects] = useState<string>("no")
  const [industryProjectCount, setIndustryProjectCount] = useState<number>(0)

  // State for industry attachments
  const [hasIndustryAttachments, setHasIndustryAttachments] = useState<string>("no")
  const [industryAttachmentCount, setIndustryAttachmentCount] = useState<number>(0)

  // Initialize form state from existing data
  useEffect(() => {
    if (industryInteraction.industryProjects.length > 0) {
      setHasIndustryProjects("yes")
      setIndustryProjectCount(industryInteraction.industryProjects.length)
    }

    if (industryInteraction.industryAttachments.length > 0) {
      setHasIndustryAttachments("yes")
      setIndustryAttachmentCount(industryInteraction.industryAttachments.length)
    }
  }, [industryInteraction])

  // Handle industry projects count change
  const handleIndustryProjectCountChange = (count: number) => {
    setIndustryProjectCount(count)

    const currentProjects = [...industryInteraction.industryProjects]

    if (count > currentProjects.length) {
      // Add new empty projects
      const newProjects = Array(count - currentProjects.length)
        .fill(null)
        .map(
          () =>
            ({
              title: "",
              company: "",
              startDate: "",
              endDate: "",
              status: "ongoing",
              calculatedPoints: 1, // Default 1 point per project
            }) as IndustryProject,
        )

      const updatedIndustryInteraction = {
        ...industryInteraction,
        industryProjects: [...currentProjects, ...newProjects],
      }

      updatedIndustryInteraction.totalPoints = calculateIndustryInteractionPoints(updatedIndustryInteraction)
      setIndustryInteraction(updatedIndustryInteraction)
    } else if (count < currentProjects.length) {
      // Remove excess projects
      const updatedIndustryInteraction = {
        ...industryInteraction,
        industryProjects: currentProjects.slice(0, count),
      }

      updatedIndustryInteraction.totalPoints = calculateIndustryInteractionPoints(updatedIndustryInteraction)
      setIndustryInteraction(updatedIndustryInteraction)
    }
  }

  // Handle industry attachments count change
  const handleIndustryAttachmentCountChange = (count: number) => {
    setIndustryAttachmentCount(count)

    const currentAttachments = [...industryInteraction.industryAttachments]

    if (count > currentAttachments.length) {
      // Add new empty attachments
      const newAttachments = Array(count - currentAttachments.length)
        .fill(null)
        .map(
          () =>
            ({
              company: "",
              startDate: "",
              endDate: "",
              duration: 4, // Default 4 weeks
              calculatedPoints: 1, // Default 1 point for 4 weeks
            }) as IndustryAttachment,
        )

      const updatedIndustryInteraction = {
        ...industryInteraction,
        industryAttachments: [...currentAttachments, ...newAttachments],
      }

      updatedIndustryInteraction.totalPoints = calculateIndustryInteractionPoints(updatedIndustryInteraction)
      setIndustryInteraction(updatedIndustryInteraction)
    } else if (count < currentAttachments.length) {
      // Remove excess attachments
      const updatedIndustryInteraction = {
        ...industryInteraction,
        industryAttachments: currentAttachments.slice(0, count),
      }

      updatedIndustryInteraction.totalPoints = calculateIndustryInteractionPoints(updatedIndustryInteraction)
      setIndustryInteraction(updatedIndustryInteraction)
    }
  }

  // Update industry project field
  const updateIndustryProject = (index: number, field: keyof IndustryProject, value: any) => {
    const updatedProjects = [...industryInteraction.industryProjects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }

    // Update calculated points
    updatedProjects[index].calculatedPoints = calculateIndustryProjectPoints(updatedProjects[index])

    const updatedIndustryInteraction = {
      ...industryInteraction,
      industryProjects: updatedProjects,
    }

    updatedIndustryInteraction.totalPoints = calculateIndustryInteractionPoints(updatedIndustryInteraction)
    setIndustryInteraction(updatedIndustryInteraction)
  }

  // Update industry attachment field
  const updateIndustryAttachment = (index: number, field: keyof IndustryAttachment, value: any) => {
    const updatedAttachments = [...industryInteraction.industryAttachments]
    updatedAttachments[index] = {
      ...updatedAttachments[index],
      [field]: value,
    }

    // Update calculated points based on duration
    if (field === "duration") {
      updatedAttachments[index].calculatedPoints = calculateIndustryAttachmentPoints(updatedAttachments[index])
    }

    const updatedIndustryInteraction = {
      ...industryInteraction,
      industryAttachments: updatedAttachments,
    }

    updatedIndustryInteraction.totalPoints = calculateIndustryInteractionPoints(updatedIndustryInteraction)
    setIndustryInteraction(updatedIndustryInteraction)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Industry-Institute Interaction</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{industryInteraction.totalPoints}</span>
        </div>
      </div>

      {/* Industry Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Successful completion of Industry Projects identified by the institute</CardTitle>
          <CardDescription>(No duplication with UG & PG Projects mentioned earlier)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">
              Have you ever done Successful completion of Industry Projects identified by the institute?
            </Label>
            <RadioGroup
              value={hasIndustryProjects}
              onValueChange={(value) => {
                setHasIndustryProjects(value)
                if (value === "no") {
                  handleIndustryProjectCountChange(0)
                } else if (industryProjectCount === 0) {
                  handleIndustryProjectCountChange(1)
                }
              }}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="industry-projects-yes" />
                <Label htmlFor="industry-projects-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="industry-projects-no" />
                <Label htmlFor="industry-projects-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasIndustryProjects === "yes" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="industry-project-count">How many Industry Projects have Completed Successfully?</Label>
                <Input
                  id="industry-project-count"
                  type="number"
                  min={0}
                  value={industryProjectCount}
                  onChange={(e) => handleIndustryProjectCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1 Credit Point Per Project up to a maximum of 6 Credit points
                </p>
              </div>

              {industryInteraction.industryProjects.map((project, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Information About Industry Project {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                      <Input
                        id={`project-title-${index}`}
                        value={project.title}
                        onChange={(e) => updateIndustryProject(index, "title", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`project-company-${index}`}>Company Name</Label>
                      <Input
                        id={`project-company-${index}`}
                        value={project.company}
                        onChange={(e) => updateIndustryProject(index, "company", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`project-start-${index}`}>Start Date</Label>
                        <Input
                          id={`project-start-${index}`}
                          type="date"
                          value={project.startDate}
                          onChange={(e) => updateIndustryProject(index, "startDate", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`project-end-${index}`}>End Date</Label>
                        <Input
                          id={`project-end-${index}`}
                          type="date"
                          value={project.endDate}
                          onChange={(e) => updateIndustryProject(index, "endDate", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`project-status-${index}`}>Select State of Industry Project</Label>
                      <Select
                        value={project.status}
                        onValueChange={(value) => updateIndustryProject(index, "status", value)}
                      >
                        <SelectTrigger id={`project-status-${index}`} className="mt-2">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Successfully Completed</SelectItem>
                          <SelectItem value="ongoing">On Going</SelectItem>
                          <SelectItem value="not-completed">Not Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium">Calculated Points: {project.calculatedPoints}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        1 Credit Point Per Project up to a maximum of 6 Credit points
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Industry Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Attachment of 4 to 8 week duration</CardTitle>
          <CardDescription>Select Options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">Have you ever done Industry Attachment of 4 to 8 week duration?</Label>
            <RadioGroup
              value={hasIndustryAttachments}
              onValueChange={(value) => {
                setHasIndustryAttachments(value)
                if (value === "no") {
                  handleIndustryAttachmentCountChange(0)
                } else if (industryAttachmentCount === 0) {
                  handleIndustryAttachmentCountChange(1)
                }
              }}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="industry-attachments-yes" />
                <Label htmlFor="industry-attachments-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="industry-attachments-no" />
                <Label htmlFor="industry-attachments-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasIndustryAttachments === "yes" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="industry-attachment-count">How many Industry Attachments have you done?</Label>
                <Input
                  id="industry-attachment-count"
                  type="number"
                  min={0}
                  value={industryAttachmentCount}
                  onChange={(e) => handleIndustryAttachmentCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1 Credit point for 4 Week Duration and 2 Credit Points for 8 Week duration up to a maximum 6 credit
                  points
                </p>
              </div>

              {industryInteraction.industryAttachments.map((attachment, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Information About Industry Attachment {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`attachment-company-${index}`}>Company Name</Label>
                      <Input
                        id={`attachment-company-${index}`}
                        value={attachment.company}
                        onChange={(e) => updateIndustryAttachment(index, "company", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`attachment-start-${index}`}>Start Date</Label>
                        <Input
                          id={`attachment-start-${index}`}
                          type="date"
                          value={attachment.startDate}
                          onChange={(e) => updateIndustryAttachment(index, "startDate", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`attachment-end-${index}`}>End Date</Label>
                        <Input
                          id={`attachment-end-${index}`}
                          type="date"
                          value={attachment.endDate}
                          onChange={(e) => updateIndustryAttachment(index, "endDate", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`attachment-duration-${index}`}>Select Duration of Industry Attachment</Label>
                      <Select
                        value={attachment.duration.toString()}
                        onValueChange={(value) => updateIndustryAttachment(index, "duration", Number.parseInt(value))}
                      >
                        <SelectTrigger id={`attachment-duration-${index}`} className="mt-2">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">4 weeks (1 point)</SelectItem>
                          <SelectItem value="8">8 weeks (2 points)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-md">
                      <p className="text-sm font-medium">Calculated Points: {attachment.calculatedPoints}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on duration: {attachment.duration} weeks
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Section
        </Button>
        <Button onClick={onNext}>
          Next Section <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
