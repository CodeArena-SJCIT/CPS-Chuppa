"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ChevronLeft } from "lucide-react"
import type { PlacementActivitiesSection } from "@/lib/types"

interface PlacementFormProps {
  placementActivities: PlacementActivitiesSection
  setPlacementActivities: (placementActivities: PlacementActivitiesSection) => void
  onNext: () => void
  onPrevious: () => void
}

export function PlacementForm({ placementActivities, setPlacementActivities, onNext, onPrevious }: PlacementFormProps) {
  // Simplified form with direct input fields
  const handlePointsChange = (value: string) => {
    const points = Number.parseInt(value) || 0
    setPlacementActivities({
      ...placementActivities,
      totalPoints: points,
      // Keep the existing arrays but we won't use them in the simplified form
      placementPercentage: placementActivities.placementPercentage,
      placementAssistance: placementActivities.placementAssistance,
      startupMentoring: placementActivities.startupMentoring,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Placement Activities</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{placementActivities.totalPoints}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Placement Percentage</CardTitle>
          <CardDescription>Enter details about placement percentage achieved</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="placement-details">Placement Percentage Details</Label>
              <Textarea
                id="placement-details"
                placeholder="Enter details about placement percentage (academic year, percentage achieved, etc.)"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="placement-points">Points Claimed</Label>
              <Input
                id="placement-points"
                type="number"
                placeholder="Enter points"
                value={placementActivities.totalPoints}
                onChange={(e) => handlePointsChange(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Points based on percentage achieved, maximum 20 points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placement Assistance</CardTitle>
          <CardDescription>Enter details about placement assistance provided</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="assistance-details">Placement Assistance Details</Label>
              <Textarea
                id="assistance-details"
                placeholder="Enter details about placement assistance (academic year, number of students placed, etc.)"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Startup Mentoring</CardTitle>
          <CardDescription>Enter details about startups mentored</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="startup-details">Startup Mentoring Details</Label>
              <Textarea
                id="startup-details"
                placeholder="Enter details about startups mentored (startup name, student names, duration, etc.)"
                rows={4}
              />
            </div>
          </div>
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
