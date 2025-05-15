"use client"

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, ChevronLeft } from "lucide-react"
import type { AdministrationSection, AdministrativeRole, CommitteeRole, DepartmentalActivity } from "@/lib/types"
import {
  calculateAdministrationPoints,
  calculateAdministrativeRolePoints,
  calculateCommitteeRolePoints,
  calculateDepartmentalActivityPoints,
} from "@/lib/point-calculator"

interface AdministrationFormProps {
  administration: AdministrationSection
  setAdministration: (administration: AdministrationSection) => void
  onNext: () => void
  onPrevious: () => void
}

export function AdministrationForm({ administration, setAdministration, onNext, onPrevious }: AdministrationFormProps) {
  // State for high-level administrative roles
  const [hasHighLevelRoles, setHasHighLevelRoles] = useState<string>("no")

  // State for committee roles
  const [hasCommitteeRoles, setHasCommitteeRoles] = useState<string>("no")

  // State for conference organization
  const [hasOrganizedConferences, setHasOrganizedConferences] = useState<string>("no")
  const [conferenceCount, setConferenceCount] = useState<number>(0)

  // Administrative Roles
  const [newAdminRole, setNewAdminRole] = useState<Partial<AdministrativeRole>>({
    role: "",
    startDate: "",
    endDate: "",
    calculatedPoints: 0,
  })

  // Committee Roles
  const [newCommitteeRole, setNewCommitteeRole] = useState<Partial<CommitteeRole>>({
    committee: "",
    role: "",
    startDate: "",
    endDate: "",
    calculatedPoints: 0,
  })

  // Departmental Activities
  const [newDeptActivity, setNewDeptActivity] = useState<Partial<DepartmentalActivity>>({
    activity: "",
    role: "",
    startDate: "",
    endDate: "",
    calculatedPoints: 0,
  })

  // Initialize form state from existing data
  useEffect(() => {
    if (administration.administrativeRoles.length > 0) {
      setHasHighLevelRoles("yes")
    }

    if (administration.committeeRoles.length > 0) {
      setHasCommitteeRoles("yes")
    }

    // Check if there are any conference organizer roles
    const conferenceRoles = administration.departmentalActivities.filter((activity) =>
      activity.activity.toLowerCase().includes("conference"),
    )

    if (conferenceRoles.length > 0) {
      setHasOrganizedConferences("yes")
      setConferenceCount(conferenceRoles.length)
    }
  }, [administration])

  // Handle high-level administrative roles
  const handleHighLevelRoles = (value: string) => {
    setHasHighLevelRoles(value)

    if (value === "yes") {
      // Add a default administrative role if none exists
      if (administration.administrativeRoles.length === 0) {
        const updatedAdministration = {
          ...administration,
          administrativeRoles: [
            {
              role: "HOD",
              startDate: new Date().toISOString().split("T")[0],
              endDate: new Date().toISOString().split("T")[0],
              calculatedPoints: 1, // Default 1 point per year
            },
          ],
        }

        updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
        setAdministration(updatedAdministration)
      }
    } else {
      // Remove all administrative roles
      const updatedAdministration = {
        ...administration,
        administrativeRoles: [],
      }

      updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
      setAdministration(updatedAdministration)
    }
  }

  // Handle committee roles
  const handleCommitteeRoles = (value: string) => {
    setHasCommitteeRoles(value)

    if (value === "yes") {
      // Add a default committee role if none exists
      if (administration.committeeRoles.length === 0) {
        const updatedAdministration = {
          ...administration,
          committeeRoles: [
            {
              committee: "Functional Committee",
              role: "Chairman",
              startDate: new Date().toISOString().split("T")[0],
              endDate: new Date().toISOString().split("T")[0],
              calculatedPoints: 0.75, // Default 0.75 points per year for chairman
            },
          ],
        }

        updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
        setAdministration(updatedAdministration)
      }
    } else {
      // Remove all committee roles
      const updatedAdministration = {
        ...administration,
        committeeRoles: [],
      }

      updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
      setAdministration(updatedAdministration)
    }
  }

  // Handle conference count change
  const handleConferenceCountChange = (count: number) => {
    setConferenceCount(count)

    // Filter out conference activities
    const nonConferenceActivities = administration.departmentalActivities.filter(
      (activity) => !activity.activity.toLowerCase().includes("conference"),
    )

    if (count > 0) {
      // Add new conference activities
      const conferenceActivities = Array(count)
        .fill(null)
        .map(
          () =>
            ({
              activity: "National/International Conference",
              role: "Chairman",
              startDate: new Date().toISOString().split("T")[0],
              endDate: new Date().toISOString().split("T")[0],
              calculatedPoints: 1, // 1 point per program
            }) as DepartmentalActivity,
        )

      const updatedAdministration = {
        ...administration,
        departmentalActivities: [...nonConferenceActivities, ...conferenceActivities],
      }

      updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
      setAdministration(updatedAdministration)
    } else {
      // Remove all conference activities
      const updatedAdministration = {
        ...administration,
        departmentalActivities: nonConferenceActivities,
      }

      updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
      setAdministration(updatedAdministration)
    }
  }

  // Update administrative role
  const updateAdministrativeRole = (index: number, field: keyof AdministrativeRole, value: any) => {
    const updatedRoles = [...administration.administrativeRoles]
    updatedRoles[index] = {
      ...updatedRoles[index],
      [field]: value,
    }

    // Update points based on duration
    if (field === "startDate" || field === "endDate") {
      updatedRoles[index].calculatedPoints = calculateAdministrativeRolePoints(updatedRoles[index])
    }

    const updatedAdministration = {
      ...administration,
      administrativeRoles: updatedRoles,
    }

    updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
    setAdministration(updatedAdministration)
  }

  // Update committee role
  const updateCommitteeRole = (index: number, field: keyof CommitteeRole, value: any) => {
    const updatedRoles = [...administration.committeeRoles]
    updatedRoles[index] = {
      ...updatedRoles[index],
      [field]: value,
    }

    // Update points based on role and duration
    if (field === "role" || field === "startDate" || field === "endDate") {
      updatedRoles[index].calculatedPoints = calculateCommitteeRolePoints(updatedRoles[index])
    }

    const updatedAdministration = {
      ...administration,
      committeeRoles: updatedRoles,
    }

    updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
    setAdministration(updatedAdministration)
  }

  // Update departmental activity (conference)
  const updateConference = (index: number, field: keyof DepartmentalActivity, value: any) => {
    // Find the index in the full departmental activities array
    const conferenceActivities = administration.departmentalActivities.filter((activity) =>
      activity.activity.toLowerCase().includes("conference"),
    )

    if (index >= conferenceActivities.length) return

    const fullIndex = administration.departmentalActivities.findIndex(
      (activity) => activity === conferenceActivities[index],
    )

    if (fullIndex === -1) return

    const updatedActivities = [...administration.departmentalActivities]
    updatedActivities[fullIndex] = {
      ...updatedActivities[fullIndex],
      [field]: value,
    }

    // Update points
    updatedActivities[fullIndex].calculatedPoints = calculateDepartmentalActivityPoints(updatedActivities[fullIndex])

    const updatedAdministration = {
      ...administration,
      departmentalActivities: updatedActivities,
    }

    updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)
    setAdministration(updatedAdministration)
  }

  // Add administrative role
  const addAdministrativeRole = () => {
    if (!newAdminRole.role) return

    const updatedRoles = [
      ...administration.administrativeRoles,
      {
        ...newAdminRole,
        role: newAdminRole.role || "",
        startDate: newAdminRole.startDate || new Date().toISOString().split("T")[0],
        endDate: newAdminRole.endDate || new Date().toISOString().split("T")[0],
        calculatedPoints: newAdminRole.calculatedPoints || 0,
      } as AdministrativeRole,
    ]

    const updatedAdministration = {
      ...administration,
      administrativeRoles: updatedRoles,
    }

    // Recalculate total points
    updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)

    setAdministration(updatedAdministration)
    setNewAdminRole({
      role: "",
      startDate: "",
      endDate: "",
      calculatedPoints: 0,
    })
    setActiveDialog(null)
  }

  // Add committee role
  const addCommitteeRole = () => {
    if (!newCommitteeRole.committee || !newCommitteeRole.role) return

    const updatedRoles = [
      ...administration.committeeRoles,
      {
        ...newCommitteeRole,
        committee: newCommitteeRole.committee || "",
        role: newCommitteeRole.role || "",
        startDate: newCommitteeRole.startDate || new Date().toISOString().split("T")[0],
        endDate: newCommitteeRole.endDate || new Date().toISOString().split("T")[0],
        calculatedPoints: newCommitteeRole.calculatedPoints || 0,
      } as CommitteeRole,
    ]

    const updatedAdministration = {
      ...administration,
      committeeRoles: updatedRoles,
    }

    // Recalculate total points
    updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)

    setAdministration(updatedAdministration)
    setNewCommitteeRole({
      committee: "",
      role: "",
      startDate: "",
      endDate: "",
      calculatedPoints: 0,
    })
    setActiveDialog(null)
  }

  // Add departmental activity
  const addDepartmentalActivity = () => {
    if (!newDeptActivity.activity || !newDeptActivity.role) return

    const updatedActivities = [
      ...administration.departmentalActivities,
      {
        ...newDeptActivity,
        activity: newDeptActivity.activity || "",
        role: newDeptActivity.role || "",
        startDate: newDeptActivity.startDate || new Date().toISOString().split("T")[0],
        endDate: newDeptActivity.endDate || new Date().toISOString().split("T")[0],
        calculatedPoints: newDeptActivity.calculatedPoints || 0,
      } as DepartmentalActivity,
    ]

    const updatedAdministration = {
      ...administration,
      departmentalActivities: updatedActivities,
    }

    // Recalculate total points
    updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)

    setAdministration(updatedAdministration)
    setNewDeptActivity({
      activity: "",
      role: "",
      startDate: "",
      endDate: "",
      calculatedPoints: 0,
    })
    setActiveDialog(null)
  }

  // Remove item from any section
  const removeItem = (section: keyof AdministrationSection, index: number) => {
    if (!Array.isArray(administration[section])) return

    const updatedItems = [...(administration[section] as any[])]
    updatedItems.splice(index, 1)

    const updatedAdministration = {
      ...administration,
      [section]: updatedItems,
    }

    // Recalculate total points
    updatedAdministration.totalPoints = calculateAdministrationPoints(updatedAdministration)

    setAdministration(updatedAdministration)
  }

  const [activeDialog, setActiveDialog] = useState<"adminRole" | "committeeRole" | "deptActivity" | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Administrative Responsibilities</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{administration.totalPoints}</span>
        </div>
      </div>

      {/* High-level Administrative Roles */}
      <Card>
        <CardHeader>
          <CardTitle>HOD, Dean, COE, Chief Warden, Director, Associate Director (Research), IQAC Coordinator</CardTitle>
          <CardDescription>Select Options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">
              Do you have any positions of HOD, Dean, COE, Chief Warden, Director, Associate Director (Research), IQAC
              Coordinator?
            </Label>
            <RadioGroup
              value={hasHighLevelRoles}
              onValueChange={handleHighLevelRoles}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="high-level-roles-yes" />
                <Label htmlFor="high-level-roles-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="high-level-roles-no" />
                <Label htmlFor="high-level-roles-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasHighLevelRoles === "yes" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-role-type">Select Position</Label>
                <Select
                  value={administration.administrativeRoles[0]?.role || ""}
                  onValueChange={(value) => updateAdministrativeRole(0, "role", value)}
                >
                  <SelectTrigger id="admin-role-type" className="mt-2">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOD">HOD</SelectItem>
                    <SelectItem value="Dean">Dean</SelectItem>
                    <SelectItem value="COE">COE</SelectItem>
                    <SelectItem value="Chief Warden">Chief Warden</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Associate Director (Research)">Associate Director (Research)</SelectItem>
                    <SelectItem value="IQAC Coordinator">IQAC Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin-role-start">Start Date</Label>
                  <Input
                    id="admin-role-start"
                    type="date"
                    value={administration.administrativeRoles[0]?.startDate || ""}
                    onChange={(e) => updateAdministrativeRole(0, "startDate", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-role-end">End Date</Label>
                  <Input
                    id="admin-role-end"
                    type="date"
                    value={administration.administrativeRoles[0]?.endDate || ""}
                    onChange={(e) => updateAdministrativeRole(0, "endDate", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="text-sm font-medium">
                  Calculated Points: {administration.administrativeRoles[0]?.calculatedPoints || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 point per year up to maximum of 6 credits points</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Committee Roles */}
      <Card>
        <CardHeader>
          <CardTitle>
            Chairman of all functional committees, PG Coordinators, Deputy Wardens, NSS Coordinators, NCC Coordinators,
            Cultural / Sports Coordinators, Associate COE, NAAC / NBA / NIRF Chief coordinators, IIC president, ERP /
            Timetable coordinator at the institute level
          </CardTitle>
          <CardDescription>Select Options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">
              Who holds these institute-level roles: Chairman of all functional committees, PG Coordinators, Deputy
              Wardens, etc.?
            </Label>
            <RadioGroup
              value={hasCommitteeRoles}
              onValueChange={handleCommitteeRoles}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="committee-roles-yes" />
                <Label htmlFor="committee-roles-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="committee-roles-no" />
                <Label htmlFor="committee-roles-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasCommitteeRoles === "yes" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="committee-type">Select Committee</Label>
                <Select
                  value={administration.committeeRoles[0]?.committee || ""}
                  onValueChange={(value) => updateCommitteeRole(0, "committee", value)}
                >
                  <SelectTrigger id="committee-type" className="mt-2">
                    <SelectValue placeholder="Select committee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Functional Committee">Functional Committee</SelectItem>
                    <SelectItem value="PG Coordination">PG Coordination</SelectItem>
                    <SelectItem value="Deputy Warden">Deputy Warden</SelectItem>
                    <SelectItem value="NSS Coordination">NSS Coordination</SelectItem>
                    <SelectItem value="NCC Coordination">NCC Coordination</SelectItem>
                    <SelectItem value="Cultural Committee">Cultural Committee</SelectItem>
                    <SelectItem value="Sports Committee">Sports Committee</SelectItem>
                    <SelectItem value="Associate COE">Associate COE</SelectItem>
                    <SelectItem value="NAAC Coordination">NAAC Coordination</SelectItem>
                    <SelectItem value="NBA Coordination">NBA Coordination</SelectItem>
                    <SelectItem value="NIRF Coordination">NIRF Coordination</SelectItem>
                    <SelectItem value="IIC">IIC</SelectItem>
                    <SelectItem value="ERP Coordination">ERP Coordination</SelectItem>
                    <SelectItem value="Timetable Coordination">Timetable Coordination</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="committee-role">Your Role</Label>
                <Select
                  value={administration.committeeRoles[0]?.role || ""}
                  onValueChange={(value) => updateCommitteeRole(0, "role", value)}
                >
                  <SelectTrigger id="committee-role" className="mt-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chairman">Chairman (0.75 points/year)</SelectItem>
                    <SelectItem value="PG Coordinator">PG Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="Deputy Warden">Deputy Warden (0.75 points/year)</SelectItem>
                    <SelectItem value="NSS Coordinator">NSS Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="NCC Coordinator">NCC Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="Cultural Coordinator">Cultural Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="Sports Coordinator">Sports Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="Associate COE">Associate COE (0.75 points/year)</SelectItem>
                    <SelectItem value="NAAC Coordinator">NAAC Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="NBA Coordinator">NBA Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="NIRF Coordinator">NIRF Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="IIC President">IIC President (0.75 points/year)</SelectItem>
                    <SelectItem value="ERP Coordinator">ERP Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="Timetable Coordinator">Timetable Coordinator (0.75 points/year)</SelectItem>
                    <SelectItem value="Member">Member (0.5 points/year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="committee-start">Start Date</Label>
                  <Input
                    id="committee-start"
                    type="date"
                    value={administration.committeeRoles[0]?.startDate || ""}
                    onChange={(e) => updateCommitteeRole(0, "startDate", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="committee-end">End Date</Label>
                  <Input
                    id="committee-end"
                    type="date"
                    value={administration.committeeRoles[0]?.endDate || ""}
                    onChange={(e) => updateCommitteeRole(0, "endDate", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="text-sm font-medium">
                  Calculated Points: {administration.committeeRoles[0]?.calculatedPoints || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  0.75 Credit/Year for higher roles, 0.5 Credit/Year for members, up to a maximum of 5 credit points
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conference Organization */}
      <Card>
        <CardHeader>
          <CardTitle>
            National / International conference organised as Chairman / Secretary / Convenors / Session Chair / Session
            Co-Chair
          </CardTitle>
          <CardDescription>Select Options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">
              Do you have Organized any National / International conference as Chairman / Secretary / Convenors /
              Session Chair / Session Co-Chair?
            </Label>
            <RadioGroup
              value={hasOrganizedConferences}
              onValueChange={(value) => {
                setHasOrganizedConferences(value)
                if (value === "no") {
                  handleConferenceCountChange(0)
                } else if (conferenceCount === 0) {
                  handleConferenceCountChange(1)
                }
              }}
              className="flex items-center space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="conferences-yes" />
                <Label htmlFor="conferences-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="conferences-no" />
                <Label htmlFor="conferences-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {hasOrganizedConferences === "yes" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="conference-count">
                  How many National / International conference organised as Chairman / Secretary / ...?
                </Label>
                <Input
                  id="conference-count"
                  type="number"
                  min={0}
                  value={conferenceCount}
                  onChange={(e) => handleConferenceCountChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">1 per program up to max of 3 credit points</p>
              </div>

              {Array.from({ length: conferenceCount }).map((_, index) => {
                // Find the corresponding conference activity
                const conferenceActivities = administration.departmentalActivities.filter((activity) =>
                  activity.activity.toLowerCase().includes("conference"),
                )
                const conference = conferenceActivities[index] || {
                  activity: "National/International Conference",
                  role: "Chairman",
                  startDate: "",
                  endDate: "",
                  calculatedPoints: 1,
                }

                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>Information About Conference {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`conference-title-${index}`}>Conference Title</Label>
                        <Input
                          id={`conference-title-${index}`}
                          value={conference.activity}
                          onChange={(e) => updateConference(index, "activity", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`conference-role-${index}`}>Your Role</Label>
                        <Select
                          value={conference.role}
                          onValueChange={(value) => updateConference(index, "role", value)}
                        >
                          <SelectTrigger id={`conference-role-${index}`} className="mt-2">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Chairman">Chairman</SelectItem>
                            <SelectItem value="Secretary">Secretary</SelectItem>
                            <SelectItem value="Convenor">Convenor</SelectItem>
                            <SelectItem value="Session Chair">Session Chair</SelectItem>
                            <SelectItem value="Session Co-Chair">Session Co-Chair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`conference-date-${index}`}>Conference Date</Label>
                          <Input
                            id={`conference-date-${index}`}
                            type="date"
                            value={conference.startDate}
                            onChange={(e) => {
                              updateConference(index, "startDate", e.target.value)
                              updateConference(index, "endDate", e.target.value)
                            }}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium">Calculated Points: {conference.calculatedPoints}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          1 point per program, maximum 3 points total
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
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

      {/* Administrative Role Dialog */}
      <Dialog open={activeDialog === "adminRole"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Administrative Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-role">Role Title</Label>
              <Input
                id="admin-role"
                value={newAdminRole.role}
                onChange={(e) => setNewAdminRole({ ...newAdminRole, role: e.target.value })}
                placeholder="Enter role title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-start-date">Start Date</Label>
                <Input
                  id="admin-start-date"
                  type="date"
                  value={newAdminRole.startDate}
                  onChange={(e) => setNewAdminRole({ ...newAdminRole, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-end-date">End Date</Label>
                <Input
                  id="admin-end-date"
                  type="date"
                  value={newAdminRole.endDate}
                  onChange={(e) => setNewAdminRole({ ...newAdminRole, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-points">Points Claimed</Label>
              <Input
                id="admin-points"
                type="number"
                value={newAdminRole.calculatedPoints || ""}
                onChange={(e) => setNewAdminRole({ ...newAdminRole, calculatedPoints: Number(e.target.value) })}
                placeholder="Enter points"
              />
              <p className="text-xs text-muted-foreground">1 point per year, maximum 6 points</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>
              Cancel
            </Button>
            <Button onClick={addAdministrativeRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Committee Role Dialog */}
      <Dialog open={activeDialog === "committeeRole"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Committee Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="committee-name">Committee Name</Label>
              <Input
                id="committee-name"
                value={newCommitteeRole.committee}
                onChange={(e) => setNewCommitteeRole({ ...newCommitteeRole, committee: e.target.value })}
                placeholder="Enter committee name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="committee-role">Your Role</Label>
              <Input
                id="committee-role"
                value={newCommitteeRole.role}
                onChange={(e) => setNewCommitteeRole({ ...newCommitteeRole, role: e.target.value })}
                placeholder="Enter your role in the committee"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="committee-start-date">Start Date</Label>
                <Input
                  id="committee-start-date"
                  type="date"
                  value={newCommitteeRole.startDate}
                  onChange={(e) => setNewCommitteeRole({ ...newCommitteeRole, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="committee-end-date">End Date</Label>
                <Input
                  id="committee-end-date"
                  type="date"
                  value={newCommitteeRole.endDate}
                  onChange={(e) => setNewCommitteeRole({ ...newCommitteeRole, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="committee-points">Points Claimed</Label>
              <Input
                id="committee-points"
                type="number"
                value={newCommitteeRole.calculatedPoints || ""}
                onChange={(e) => setNewCommitteeRole({ ...newCommitteeRole, calculatedPoints: Number(e.target.value) })}
                placeholder="Enter points"
              />
              <p className="text-xs text-muted-foreground">0.75 or 0.5 points per year, maximum 5 points</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>
              Cancel
            </Button>
            <Button onClick={addCommitteeRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Departmental Activity Dialog */}
      <Dialog open={activeDialog === "deptActivity"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Departmental Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="activity-name">Activity Name</Label>
              <Input
                id="activity-name"
                value={newDeptActivity.activity}
                onChange={(e) => setNewDeptActivity({ ...newDeptActivity, activity: e.target.value })}
                placeholder="Enter activity name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activity-role">Your Role</Label>
              <Input
                id="activity-role"
                value={newDeptActivity.role}
                onChange={(e) => setNewDeptActivity({ ...newDeptActivity, role: e.target.value })}
                placeholder="Enter your role in the activity"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="activity-start-date">Start Date</Label>
                <Input
                  id="activity-start-date"
                  type="date"
                  value={newDeptActivity.startDate}
                  onChange={(e) => setNewDeptActivity({ ...newDeptActivity, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="activity-end-date">End Date</Label>
                <Input
                  id="activity-end-date"
                  type="date"
                  value={newDeptActivity.endDate}
                  onChange={(e) => setNewDeptActivity({ ...newDeptActivity, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activity-points">Points Claimed</Label>
              <Input
                id="activity-points"
                type="number"
                value={newDeptActivity.calculatedPoints || ""}
                onChange={(e) => setNewDeptActivity({ ...newDeptActivity, calculatedPoints: Number(e.target.value) })}
                placeholder="Enter points"
              />
              <p className="text-xs text-muted-foreground">0.25 points per semester, maximum 5 points</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>
              Cancel
            </Button>
            <Button onClick={addDepartmentalActivity}>Add Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
