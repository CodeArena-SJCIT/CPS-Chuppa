import type {
  SponsoredProject,
  Patent,
  ConsultancyProject,
  PhDScholar,
  JournalPaper,
  ConferencePaper,
  ConferenceOrganized,
  AdministrativeRole,
  CommitteeRole,
  DepartmentalActivity,
  Workshop,
  Certification,
  NewLab,
  PGDissertation,
  UGProject,
  BookPublished,
  FacultyAppraisal,
  SubjectResult,
  IndustryAttachment,
  IndustryProject,
  PlacementPercentage,
  PlacementAssistance,
  StartupMentoring,
  ResearchSection,
  AdministrationSection,
  AcademicsSection,
  IndustryInteractionSection,
  PlacementActivitiesSection,
} from "./types"

// Research section calculations
export function calculateSponsoredProjectPoints(project: SponsoredProject): number {
  const { fundingAmount, investigators } = project
  let points = 0

  // Points based on funding amount as per guidelines
  if (fundingAmount >= 2000000) {
    points = 10 // ≥ Rs. 20 lakhs
  } else if (fundingAmount >= 1000000) {
    points = 8 // ≥ Rs. 10 lakh to < Rs. 20 lakh
  } else if (fundingAmount >= 500000) {
    points = 6 // ≥ Rs. 5 lakh to < Rs. 10 lakh
  } else if (fundingAmount >= 200000) {
    points = 4 // ≥ Rs. 2 lakh to < Rs. 5 lakh
  } else if (fundingAmount >= 100000) {
    points = 2 // ≥ Rs. 1 lakh to < Rs. 2 lakh
  } else if (fundingAmount >= 25000) {
    points = 1 // ≥ Rs. 25,000 to < Rs. 1 lakh
  }

  // Distribute points based on role
  // PI gets 60%, rest divided equally among co-investigators
  if (investigators.length > 1) {
    const isPrincipalInvestigator = investigators.some((inv) => inv.role === "PI")
    if (isPrincipalInvestigator) {
      const piPoints = points * 0.6
      const coInvestigatorPoints = (points * 0.4) / (investigators.length - 1)

      // Return points based on the current user's role
      return piPoints // or coInvestigatorPoints based on the user's role
    } else {
      // If user is not PI, they get an equal share of the remaining 40%
      return (points * 0.4) / investigators.length
    }
  }

  return points // If single investigator, they get all points
}

export function calculatePatentPoints(patent: Patent): number {
  const { status, inventors } = patent
  let points = 0

  // Points based on patent status as per guidelines
  if (status === "granted") {
    points = 10 // 10 points per patent granted
  } else if (status === "published") {
    points = 5 // 5 points per patent published
  }

  // Distribute points based on role
  // Principal inventor gets 60%, rest divided equally among co-inventors
  if (inventors.length > 1) {
    const isPrincipalInventor = inventors.some((inv) => inv.role === "Principal")
    if (isPrincipalInventor) {
      const principalPoints = points * 0.6
      const coInventorPoints = (points * 0.4) / (inventors.length - 1)

      // Return points based on the current user's role
      return principalPoints // or coInventorPoints based on the user's role
    } else {
      // If user is not principal inventor, they get an equal share of the remaining 40%
      return (points * 0.4) / inventors.length
    }
  }

  return points // If single inventor, they get all points
}

export function calculateConsultancyPoints(project: ConsultancyProject): number {
  const { amount } = project
  // 1 point per 1 lakh, max 10 points
  return Math.min(amount / 100000, 10)
}

export function calculatePhDScholarPoints(scholar: PhDScholar): number {
  const { status, supervisors } = scholar
  let points = 0

  // Points based on PhD status as per guidelines
  if (status === "awarded" || status === "submitted") {
    points = 10 // 10 points per PhD student awarded/submitted
  } else if (status === "pursuing") {
    points = 2 // 2 points per PhD student pursuing
  }

  // Distribute points based on role
  // Main guide gets 60%, rest divided equally among co-guides
  if (supervisors.length > 1) {
    const isMainGuide = supervisors.some((sup) => sup.role === "Main Guide")
    if (isMainGuide) {
      const mainGuidePoints = points * 0.6
      const coGuidePoints = (points * 0.4) / (supervisors.length - 1)

      // Return points based on the current user's role
      return mainGuidePoints // or coGuidePoints based on the user's role
    } else {
      // If user is not main guide, they get an equal share of the remaining 40%
      return (points * 0.4) / supervisors.length
    }
  }

  return points // If single supervisor, they get all points
}

export function calculateJournalPaperPoints(paper: JournalPaper): number {
  const { indexing, authors } = paper
  let points = 0

  // Points based on indexing as per guidelines
  if (indexing === "SCI" || indexing === "Scopus") {
    points = 4 // 4 points per paper
  }

  // Distribute points based on role
  // First author gets 2 points, rest divided among co-authors
  if (authors.length > 1) {
    const isFirstAuthor = authors.some((auth) => auth.role === "First Author")
    if (isFirstAuthor) {
      return 2 // First author gets 2 points
    } else {
      // Co-authors share the remaining points
      return (points - 2) / (authors.length - 1)
    }
  }

  return points // If single author, they get all points
}

export function calculateConferencePaperPoints(paper: ConferencePaper): number {
  const { indexing, authors } = paper
  let points = 0

  // Points based on indexing as per guidelines
  if (["SCI", "Scopus", "Web of Science"].includes(indexing)) {
    points = 1 // 1 point per paper
  }

  // Distribute points based on role
  // First author gets 0.6 points, rest divided among co-authors
  if (authors.length > 1) {
    const isFirstAuthor = authors.some((auth) => auth.role === "First Author")
    if (isFirstAuthor) {
      return 0.6 // First author gets 0.6 points
    } else {
      // Co-authors share the remaining points
      return (points - 0.6) / (authors.length - 1)
    }
  }

  return points // If single author, they get all points
}

export function calculateConferenceOrganizedPoints(conference: ConferenceOrganized): number {
  // 1 point per program, max 3 points
  return 1
}

// Administration section calculations
export function calculateAdministrativeRolePoints(role: AdministrativeRole): number {
  // 1 point per year, max 6 points
  const startDate = new Date(role.startDate)
  const endDate = new Date(role.endDate)
  const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  return Math.min(Math.max(1, years), 6)
}

export function calculateCommitteeRolePoints(role: CommitteeRole): number {
  // 0.75 points per year for certain roles, 0.5 for others, max 5 points
  const startDate = new Date(role.startDate)
  const endDate = new Date(role.endDate)
  const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365)

  // Higher-level committee roles
  const higherRoles = [
    "Chairman",
    "PG Coordinator",
    "Deputy Warden",
    "NSS Coordinator",
    "NCC Coordinator",
    "Cultural Coordinator",
    "Sports Coordinator",
    "Associate COE",
    "NAAC Coordinator",
    "NBA Coordinator",
    "NIRF Coordinator",
    "IIC President",
    "ERP Coordinator",
    "Timetable Coordinator",
  ]

  const pointsPerYear = higherRoles.includes(role.role) ? 0.75 : 0.5
  return Math.min(pointsPerYear * years, 5)
}

export function calculateDepartmentalActivityPoints(activity: DepartmentalActivity): number {
  // 0.25 points per semester, max 5 points
  const startDate = new Date(activity.startDate)
  const endDate = new Date(activity.endDate)
  const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  const semesters = months / 6
  return Math.min(0.25 * semesters, 5)
}

// Academics section calculations
export function calculateWorkshopPoints(workshop: Workshop): number {
  // 0.5 points per course, max 5 points for organizer/resource person, max 3 for participant
  const maxPoints = workshop.role === "Participant" ? 3 : 5
  return Math.min(0.5, maxPoints)
}

export function calculateCertificationPoints(certification: Certification): number {
  // 0.5 points per course, max 5 points
  return 0.5
}

export function calculateNewLabPoints(lab: NewLab): number {
  // 4 points per new lab
  return 4
}

export function calculatePGDissertationPoints(dissertation: PGDissertation): number {
  // 0.5 points per project, max 10 points
  return 0.5
}

export function calculateUGProjectPoints(project: UGProject): number {
  // 0.25 points per project, max 5 points
  return 0.25
}

export function calculateBookPublishedPoints(book: BookPublished): number {
  // 3 points per international book, max 9 points
  // 2 points per national book, max 4 points
  return book.level === "International" ? 3 : 2
}

export function calculateFacultyAppraisalPoints(appraisal: FacultyAppraisal): number {
  // Points based on appraisal percentage, max 8 points
  const { appraisalPercentage } = appraisal

  if (appraisalPercentage >= 90) {
    return 0.25
  } else if (appraisalPercentage >= 80) {
    return 0.2
  } else if (appraisalPercentage >= 65) {
    return 0.15
  } else {
    return 0
  }
}

export function calculateSubjectResultPoints(result: SubjectResult): number {
  // Points based on pass percentage, max 8 points
  const { passPercentage } = result

  if (passPercentage >= 90) {
    return 0.25
  } else if (passPercentage >= 80) {
    return 0.2
  } else if (passPercentage >= 65) {
    return 0.15
  } else {
    return 0
  }
}

// Industry-Institute-Interaction section calculations
export function calculateIndustryAttachmentPoints(attachment: IndustryAttachment): number {
  // 1 point for 4 weeks, 2 points for 8 weeks, max 6 points
  const { duration } = attachment

  if (duration >= 8) {
    return 2
  } else if (duration >= 4) {
    return 1
  } else {
    return 0
  }
}

export function calculateIndustryProjectPoints(project: IndustryProject): number {
  // 1 point per project, max 6 points
  return 1
}

// Placement Activities section calculations
export function calculatePlacementPercentagePoints(placement: PlacementPercentage): number {
  // Points based on placement percentage, max 20 points
  const { percentage } = placement

  if (percentage >= 85) {
    return 4
  } else if (percentage >= 75) {
    return 2
  } else if (percentage >= 65) {
    return 1
  } else if (percentage >= 50) {
    return 0.5
  } else {
    return 0
  }
}

export function calculatePlacementAssistancePoints(assistance: PlacementAssistance): number {
  // 0.25 points per student placed, max 5 points per year
  return Math.min(assistance.studentsPlaced * 0.25, 5)
}

export function calculateStartupMentoringPoints(startup: StartupMentoring): number {
  // 5 points per startup
  return 5
}

// Calculate total points for each section
export function calculateResearchPoints(research: ResearchSection): number {
  let total = 0

  // Sum points from sponsored projects
  total += research.sponsoredProjects.reduce((sum, project) => sum + project.calculatedPoints, 0)

  // Sum points from patents
  total += research.patents.reduce((sum, patent) => sum + patent.calculatedPoints, 0)

  // Sum points from consultancy projects (max 10 total)
  const consultancyPoints = research.consultancyProjects.reduce((sum, project) => sum + project.calculatedPoints, 0)
  total += Math.min(consultancyPoints, 10)

  // Sum points from PhD scholars
  // Awarded/submitted: 10 points each
  // Pursuing: 2 points each, max 10 points total
  const pursuingPoints = research.phdScholars
    .filter((scholar) => scholar.status === "pursuing")
    .reduce((sum, scholar) => sum + scholar.calculatedPoints, 0)
  const awardedPoints = research.phdScholars
    .filter((scholar) => scholar.status === "awarded" || scholar.status === "submitted")
    .reduce((sum, scholar) => sum + scholar.calculatedPoints, 0)
  total += awardedPoints + Math.min(pursuingPoints, 10)

  // Sum points from journal papers (max 10 total)
  const journalPoints = research.journalPapers.reduce((sum, paper) => sum + paper.calculatedPoints, 0)
  total += Math.min(journalPoints, 10)

  // Sum points from conference papers (max 10 total)
  const conferencePoints = research.conferencePapers.reduce((sum, paper) => sum + paper.calculatedPoints, 0)
  total += Math.min(conferencePoints, 10)

  // Sum points from conferences organized (max 3 total)
  const conferenceOrgPoints = research.conferencesOrganized.reduce((sum, conf) => sum + conf.calculatedPoints, 0)
  total += Math.min(conferenceOrgPoints, 3)

  return total
}

export function calculateAdministrationPoints(administration: AdministrationSection): number {
  let total = 0

  // Sum points from administrative roles (max 6 total)
  const adminRolePoints = administration.administrativeRoles.reduce((sum, role) => sum + role.calculatedPoints, 0)
  total += Math.min(adminRolePoints, 6)

  // Sum points from committee roles (max 5 total)
  const committeePoints = administration.committeeRoles.reduce((sum, role) => sum + role.calculatedPoints, 0)
  total += Math.min(committeePoints, 5)

  // Sum points from departmental activities (max 5 total)
  const deptActivityPoints = administration.departmentalActivities.reduce(
    (sum, activity) => sum + activity.calculatedPoints,
    0,
  )
  total += Math.min(deptActivityPoints, 5)

  return total
}

export function calculateAcademicsPoints(academics: AcademicsSection): number {
  let total = 0

  // Sum points from workshops (max 5 for organizer/resource person, max 3 for participant)
  const organizerWorkshopPoints = academics.workshops
    .filter((workshop) => workshop.role !== "Participant")
    .reduce((sum, workshop) => sum + workshop.calculatedPoints, 0)
  const participantWorkshopPoints = academics.workshops
    .filter((workshop) => workshop.role === "Participant")
    .reduce((sum, workshop) => sum + workshop.calculatedPoints, 0)
  total += Math.min(organizerWorkshopPoints, 5) + Math.min(participantWorkshopPoints, 3)

  // Sum points from certifications (max 5 total)
  const certificationPoints = academics.certifications.reduce((sum, cert) => sum + cert.calculatedPoints, 0)
  total += Math.min(certificationPoints, 5)

  // Sum points from new labs (4 points each)
  total += academics.newLabs.reduce((sum, lab) => sum + lab.calculatedPoints, 0)

  // Sum points from PG dissertations (0.5 per project, max 10 total)
  const pgDissertationPoints = academics.pgDissertations.reduce(
    (sum, dissertation) => sum + dissertation.calculatedPoints,
    0,
  )
  total += Math.min(pgDissertationPoints, 10)

  // Sum points from UG projects (0.25 per project, max 5 total)
  const ugProjectPoints = academics.ugProjects.reduce((sum, project) => sum + project.calculatedPoints, 0)
  total += Math.min(ugProjectPoints, 5)

  // Sum points from books published
  // International: 3 per book, max 9
  // National: 2 per book, max 4
  const intlBookPoints = academics.booksPublished
    .filter((book) => book.level === "International")
    .reduce((sum, book) => sum + book.calculatedPoints, 0)
  const nationalBookPoints = academics.booksPublished
    .filter((book) => book.level === "National")
    .reduce((sum, book) => sum + book.calculatedPoints, 0)
  total += Math.min(intlBookPoints, 9) + Math.min(nationalBookPoints, 4)

  // Sum points from faculty appraisal (max 8 total)
  const appraisalPoints = academics.facultyAppraisal.reduce((sum, appraisal) => sum + appraisal.calculatedPoints, 0)
  total += Math.min(appraisalPoints, 8)

  // Sum points from subject results (max 8 total)
  const resultPoints = academics.subjectResults.reduce((sum, result) => sum + result.calculatedPoints, 0)
  total += Math.min(resultPoints, 8)

  return total
}

export function calculateIndustryInteractionPoints(industryInteraction: IndustryInteractionSection): number {
  let total = 0

  // Sum points from industry attachments (max 6 total)
  const attachmentPoints = industryInteraction.industryAttachments.reduce(
    (sum, attachment) => sum + attachment.calculatedPoints,
    0,
  )
  total += Math.min(attachmentPoints, 6)

  // Sum points from industry projects (max 6 total)
  const projectPoints = industryInteraction.industryProjects.reduce((sum, project) => sum + project.calculatedPoints, 0)
  total += Math.min(projectPoints, 6)

  return total
}

export function calculatePlacementActivitiesPoints(placementActivities: PlacementActivitiesSection): number {
  let total = 0

  // Sum points from placement percentage (max 20 total)
  const percentagePoints = placementActivities.placementPercentage.reduce(
    (sum, percentage) => sum + percentage.calculatedPoints,
    0,
  )
  total += Math.min(percentagePoints, 20)

  // Sum points from placement assistance (max 5 per year)
  total += placementActivities.placementAssistance.reduce((sum, assistance) => sum + assistance.calculatedPoints, 0)

  // Sum points from startup mentoring (5 per startup)
  total += placementActivities.startupMentoring.reduce((sum, startup) => sum + startup.calculatedPoints, 0)

  return total
}

// Calculate total points for the entire form
export function calculateTotalPoints(
  research: ResearchSection,
  administration: AdministrationSection,
  academics: AcademicsSection,
  industryInteraction: IndustryInteractionSection,
  placementActivities: PlacementActivitiesSection,
): number {
  return (
    calculateResearchPoints(research) +
    calculateAdministrationPoints(administration) +
    calculateAcademicsPoints(academics) +
    calculateIndustryInteractionPoints(industryInteraction) +
    calculatePlacementActivitiesPoints(placementActivities)
  )
}
