"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, ChevronLeft } from "lucide-react"
import type { AcademicsSection, PhDScholar } from "@/lib/types"
import { calculateAcademicsPoints, calculatePhDScholarPoints } from "@/lib/point-calculator"

interface AcademicsFormProps {
  academics: AcademicsSection
  setAcademics: (academics: AcademicsSection) => void
  onNext: () => void
  onPrevious: () => void
}

export function AcademicsForm({ academics, setAcademics, onNext, onPrevious }: AcademicsFormProps) {
  // State for PhD scholars
  const [hasPhDScholars, setHasPhDScholars] = useState<string>("no")
  const [completedPhDCount, setCompletedPhDCount] = useState<number>(0)
  const [pursuingPhDCount, setPursuingPhDCount] = useState<number>(0)

  // Initialize form state from existing data
  useEffect(() => {
    const completedScholars = academics.phdScholars.filter(
      (scholar) => scholar.status === "awarded" || scholar.status === "submitted",
    )

    const pursuingScholars = academics.phdScholars.filter((scholar) => scholar.status === "pursuing")

    if (completedScholars.length > 0 || pursuingScholars.length > 0) {
      setHasPhDScholars("yes")
      setCompletedPhDCount(completedScholars.length)
      setPursuingPhDCount(pursuingScholars.length)
    }
  }, [academics])

  // Handle PhD scholars
  const handlePhDScholars = (value: string) => {
    setHasPhDScholars(value)

    if (value === "no") {
      // Remove all PhD scholars
      const updatedAcademics = {
        ...academics,
        phdScholars: [],
      }

      updatedAcademics.totalPoints = calculateAcademicsPoints(updatedAcademics)
      setAcademics(updatedAcademics)

      setCompletedPhDCount(0)
      setPursuingPhDCount(0)
    }
  }

  // Handle completed PhD count change
  const handleCompletedPhDCountChange = (count: number) => {
    setCompletedPhDCount(count)

    // Get current pursuing scholars
    const pursuingScholars = academics.phdScholars.filter((scholar) => scholar.status === "pursuing")

    // Get current completed scholars
    const completedScholars = academics.phdScholars.filter(
      (scholar) => scholar.status === "awarded" || scholar.status === "submitted",
    )

    if (count > completedScholars.length) {
      // Add new completed scholars
      const newScholars = Array(count - completedScholars.length)
        .fill(null)
        .map(
          () =>
            ({
              name: "",
              title: "",
              status: "awarded",
              startDate: "",
              completionDate: "",
              supervisors: [{ name: "", role: "Main Guide" }],
              calculatedPoints: 10, // 10 points per awarded/submitted PhD
            }) as PhDScholar,
        )

      const updatedAcademics = {
        ...academics,
        phdScholars: [...pursuingScholars, ...completedScholars, ...newScholars],
      }

      updatedAcademics.totalPoints = calculateAcademicsPoints(updatedAcademics)
      setAcademics(updatedAcademics)
    } else if (count < completedScholars.length) {
      // Remove excess completed scholars
      const updatedAcademics = {
        ...academics,
        phdScholars: [...pursuingScholars, ...completedScholars.slice(0, count)],
      }

      updatedAcademics.totalPoints = calculateAcademicsPoints(updatedAcademics)
      setAcademics(updatedAcademics)
    }
  }

  // Handle pursuing PhD count change
  const handlePursuingPhDCountChange = (count: number) => {
    setPursuingPhDCount(count)

    // Get current pursuing scholars
    const pursuingScholars = academics.phdScholars.filter((scholar) => scholar.status === "pursuing")

    // Get current completed scholars
    const completedScholars = academics.phdScholars.filter(
      (scholar) => scholar.status === "awarded" || scholar.status === "submitted",
    )

    if (count > pursuingScholars.length) {
      // Add new pursuing scholars
      const newScholars = Array(count - pursuingScholars.length)
        .fill(null)
        .map(
          () =>
            ({
              name: "",
              title: "",
              status: "pursuing",
              startDate: "",
              supervisors: [{ name: "", role: "Main Guide" }],
              calculatedPoints: 2, // 2 points per pursuing PhD, max 10 total
            }) as PhDScholar,
        )

      const updatedAcademics = {
        ...academics,
        phdScholars: [...completedScholars, ...pursuingScholars, ...newScholars],
      }

      updatedAcademics.totalPoints = calculateAcademicsPoints(updatedAcademics)
      setAcademics(updatedAcademics)
    } else if (count < pursuingScholars.length) {
      // Remove excess pursuing scholars
      const updatedAcademics = {
        ...academics,
        phdScholars: [...completedScholars, ...pursuingScholars.slice(0, count)],
      }

      updatedAcademics.totalPoints = calculateAcademicsPoints(updatedAcademics)
      setAcademics(updatedAcademics)
    }
  }

  // Update PhD scholar field
  const updatePhDScholar = (index: number, field: keyof PhDScholar, value: any) => {
    const updatedScholars = [...academics.phdScholars]
    updatedScholars[index] = {
      ...updatedScholars[index],
      [field]: value,
    }

    // Update calculated points based on status and supervisors
    if (field === "status" || field === "supervisors") {
      updatedScholars[index].calculatedPoints = calculatePhDScholarPoints(updatedScholars[index])
    }

    const updatedAcademics = {
      ...academics,
      phdScholars: updatedScholars,
    }

    updatedAcademics.totalPoints = calculateAcademicsPoints(updatedAcademics)
    setAcademics(updatedAcademics)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Academic Activities</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{academics.totalPoints}</span>
        </div>
      </div>

      {/* PhD Scholars */}
      <Card>
        <CardHeader>
          <CardTitle>Ph.D. Scholars</CardTitle>
          <CardDescription>Select Options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">Do you supervise any students pursuing or who have completed a Ph.D?</Label>
            <RadioGroup
              value={hasPhDScholars}
              onValueChange={handlePhDScholars}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="phd-scholars-yes" />
                <Label htmlFor="phd-scholars-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="phd-scholars-no" />
                <Label htmlFor="phd-scholars-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasPhDScholars === "yes" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="completed-phd-count">How many students have been Awarded Ph.D.</Label>
                <Input
                  id="completed-phd-count"
                  type="number"
                  min={0}
                  value={completedPhDCount}
                  onChange={(e) => handleCompletedPhDCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  10 credit points per Ph.D. Student (Awarded/Thesis submitted)
                </p>
              </div>

              {/* Completed PhD Scholars */}
              {academics.phdScholars
                .filter((scholar) => scholar.status === "awarded" || scholar.status === "submitted")
                .map((scholar, index) => (
                  <Card key={`completed-${index}`}>
                    <CardHeader>
                      <CardTitle>Information About Ph.D. Completed Student {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`completed-name-${index}`}>Student Name</Label>
                        <Input
                          id={`completed-name-${index}`}
                          value={scholar.name}
                          onChange={(e) =>
                            updatePhDScholar(
                              academics.phdScholars.findIndex((s) => s === scholar),
                              "name",
                              e.target.value,
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`completed-title-${index}`}>Thesis Title</Label>
                        <Input
                          id={`completed-title-${index}`}
                          value={scholar.title}
                          onChange={(e) =>
                            updatePhDScholar(
                              academics.phdScholars.findIndex((s) => s === scholar),
                              "title",
                              e.target.value,
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`completed-status-${index}`}>Status</Label>
                        <Select
                          value={scholar.status}
                          onValueChange={(value) =>
                            updatePhDScholar(
                              academics.phdScholars.findIndex((s) => s === scholar),
                              "status",
                              value,
                            )
                          }
                        >
                          <SelectTrigger id={`completed-status-${index}`} className="mt-2">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="awarded">Awarded</SelectItem>
                            <SelectItem value="submitted">Thesis Submitted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`completed-role-${index}`}>Your Role</Label>
                        <Select
                          value={scholar.supervisors[0]?.role || "Main Guide"}
                          onValueChange={(value) => {
                            const scholarIndex = academics.phdScholars.findIndex((s) => s === scholar)
                            updatePhDScholar(scholarIndex, "supervisors", [
                              { name: "", role: value as "Main Guide" | "Co-Guide" },
                            ])
                          }}
                        >
                          <SelectTrigger id={`completed-role-${index}`} className="mt-2">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Main Guide">Main Guide (60% of points)</SelectItem>
                            <SelectItem value="Co-Guide">Co-Guide (Share of 40%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium">Calculated Points: {scholar.calculatedPoints}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on status: {scholar.status} and your role:{" "}
                          {scholar.supervisors[0]?.role || "Main Guide"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              <div>
                <Label htmlFor="pursuing-phd-count">How many Students are Pursuing Ph.D.</Label>
                <Input
                  id="pursuing-phd-count"
                  type="number"
                  min={0}
                  value={pursuingPhDCount}
                  onChange={(e) => handlePursuingPhDCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  2 credit points per Ph.D. Student, subject to maximum of 10 Credit points
                </p>
              </div>

              {/* Pursuing PhD Scholars */}
              {academics.phdScholars
                .filter((scholar) => scholar.status === "pursuing")
                .map((scholar, index) => (
                  <Card key={`pursuing-${index}`}>
                    <CardHeader>
                      <CardTitle>Information About Ph.D. Pursuing Student {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`pursuing-name-${index}`}>Student Name</Label>
                        <Input
                          id={`pursuing-name-${index}`}
                          value={scholar.name}
                          onChange={(e) =>
                            updatePhDScholar(
                              academics.phdScholars.findIndex((s) => s === scholar),
                              "name",
                              e.target.value,
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`pursuing-title-${index}`}>Thesis Title</Label>
                        <Input
                          id={`pursuing-title-${index}`}
                          value={scholar.title}
                          onChange={(e) =>
                            updatePhDScholar(
                              academics.phdScholars.findIndex((s) => s === scholar),
                              "title",
                              e.target.value,
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`pursuing-role-${index}`}>Your Role</Label>
                        <Select
                          value={scholar.supervisors[0]?.role || "Main Guide"}
                          onValueChange={(value) => {
                            const scholarIndex = academics.phdScholars.findIndex((s) => s === scholar)
                            updatePhDScholar(scholarIndex, "supervisors", [
                              { name: "", role: value as "Main Guide" | "Co-Guide" },
                            ])
                          }}
                        >
                          <SelectTrigger id={`pursuing-role-${index}`} className="mt-2">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Main Guide">Main Guide (60% of points)</SelectItem>
                            <SelectItem value="Co-Guide">Co-Guide (Share of 40%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium">Calculated Points: {scholar.calculatedPoints}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on status: pursuing and your role: {scholar.supervisors[0]?.role || "Main Guide"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Note: Maximum 10 points total for all pursuing scholars
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other academic sections can be added here */}

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
