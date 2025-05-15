export enum UserRole {
  FACULTY = "faculty",
  HOD = "hod",
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
}

export interface FormSubmission {
  id: string
  userId: string
  academicYear: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  totalPoints: number
  research: ResearchSection
  administration: AdministrationSection
  academics: AcademicsSection
  industryInteraction: IndustryInteractionSection
  placementActivities: PlacementActivitiesSection
}

export interface ResearchSection {
  sponsoredProjects: SponsoredProject[]
  patents: Patent[]
  consultancyProjects: ConsultancyProject[]
  phdScholars: PhDScholar[]
  journalPapers: JournalPaper[]
  conferencePapers: ConferencePaper[]
  conferencesOrganized: ConferenceOrganized[]
  totalPoints: number
}

export interface SponsoredProject {
  title: string
  fundingAgency: string
  fundingAmount: number
  startDate: string
  endDate: string
  status: "ongoing" | "completed"
  investigators: { name: string; role: "PI" | "Co-PI" }[]
  calculatedPoints: number
}

export interface Patent {
  title: string
  applicationNumber: string
  filingDate: string
  status: "filed" | "published" | "granted"
  inventors: { name: string; role: "Principal" | "Co-inventor" }[]
  calculatedPoints: number
}

export interface ConsultancyProject {
  title: string
  client: string
  amount: number
  startDate: string
  endDate: string
  calculatedPoints: number
}

export interface PhDScholar {
  name: string
  title: string
  status: "pursuing" | "awarded" | "submitted"
  startDate: string
  completionDate?: string
  supervisors: { name: string; role: "Main Guide" | "Co-Guide" }[]
  calculatedPoints: number
}

export interface JournalPaper {
  title: string
  journal: string
  indexing: "SCI" | "Scopus" | "Other"
  publicationDate: string
  authors: { name: string; role: "First Author" | "Co-Author" }[]
  calculatedPoints: number
}

export interface ConferencePaper {
  title: string
  conference: string
  indexing: "SCI" | "Scopus" | "Web of Science" | "Other"
  presentationDate: string
  authors: { name: string; role: "First Author" | "Co-Author" }[]
  calculatedPoints: number
}

export interface ConferenceOrganized {
  title: string
  venue: string
  date: string
  role: "Chairman" | "Secretary" | "Convenor" | "Session Chair" | "Session Co-Chair"
  calculatedPoints: number
}

export interface AdministrationSection {
  administrativeRoles: AdministrativeRole[]
  committeeRoles: CommitteeRole[]
  departmentalActivities: DepartmentalActivity[]
  totalPoints: number
}

export interface AdministrativeRole {
  role: string
  startDate: string
  endDate: string
  calculatedPoints: number
}

export interface CommitteeRole {
  committee: string
  role: string
  startDate: string
  endDate: string
  calculatedPoints: number
}

export interface DepartmentalActivity {
  activity: string
  role: string
  startDate: string
  endDate: string
  calculatedPoints: number
}

export interface AcademicsSection {
  workshops: Workshop[]
  certifications: Certification[]
  newLabs: NewLab[]
  pgDissertations: PGDissertation[]
  ugProjects: UGProject[]
  booksPublished: BookPublished[]
  facultyAppraisal: FacultyAppraisal[]
  subjectResults: SubjectResult[]
  totalPoints: number
}

export interface Workshop {
  title: string
  venue: string
  startDate: string
  endDate: string
  role: "Coordinator" | "Convener" | "Resource Person" | "Participant"
  calculatedPoints: number
}

export interface Certification {
  title: string
  platform: string
  completionDate: string
  calculatedPoints: number
}

export interface NewLab {
  name: string
  description: string
  establishmentDate: string
  calculatedPoints: number
}

export interface PGDissertation {
  title: string
  studentName: string
  completionDate: string
  calculatedPoints: number
}

export interface UGProject {
  title: string
  studentNames: string[]
  completionDate: string
  calculatedPoints: number
}

export interface BookPublished {
  title: string
  publisher: string
  publishDate: string
  isbn: string
  level: "International" | "National"
  calculatedPoints: number
}

export interface FacultyAppraisal {
  subject: string
  semester: string
  academicYear: string
  appraisalPercentage: number
  calculatedPoints: number
}

export interface SubjectResult {
  subject: string
  semester: string
  academicYear: string
  passPercentage: number
  calculatedPoints: number
}

export interface IndustryInteractionSection {
  industryAttachments: IndustryAttachment[]
  industryProjects: IndustryProject[]
  totalPoints: number
}

export interface IndustryAttachment {
  company: string
  startDate: string
  endDate: string
  duration: number // in weeks
  calculatedPoints: number
}

export interface IndustryProject {
  title: string
  company: string
  startDate: string
  endDate: string
  calculatedPoints: number
}

export interface PlacementActivitiesSection {
  placementPercentage: PlacementPercentage[]
  placementAssistance: PlacementAssistance[]
  startupMentoring: StartupMentoring[]
  totalPoints: number
}

export interface PlacementPercentage {
  academicYear: string
  percentage: number
  calculatedPoints: number
}

export interface PlacementAssistance {
  academicYear: string
  studentsPlaced: number
  calculatedPoints: number
}

export interface StartupMentoring {
  startupName: string
  studentNames: string[]
  startDate: string
  description: string
  calculatedPoints: number
}
