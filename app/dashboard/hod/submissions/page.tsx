import { connectToDatabase } from "@/lib/mongodb"
import { requireRole } from "@/lib/auth"
import { UserRole } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubmissionsTable } from "@/components/hod/submissions-table"

export default async function SubmissionsPage() {
  // Ensure user is HOD
  await requireRole(UserRole.HOD)

  // Get all submissions
  const { db } = await connectToDatabase()

  // Get submissions and join with user data
  const submissionsData = await db
    .collection("submissions")
    .aggregate([
      {
        $match: { status: { $ne: "draft" } },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$userId" }, // no ObjectId conversion
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
          ],
          as: "userDetails",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$userDetails", 0] },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
      {
        $sort: { submittedDate: -1 },
      },
    ])
    .toArray()

  // Convert MongoDB documents to regular objects with string IDs
  const submissions = submissionsData.map((submission) => ({
    ...submission,
    id: submission._id?.toString(),
    _id: undefined,
    user: submission.user
      ? {
          ...submission.user,
          id: submission.user._id?.toString(),
          _id: undefined,
          password: undefined,
        }
      : {
          name: "Unknown User",
          email: "unknown@example.com",
          department: "Unknown",
          id: "unknown",
        },
  }))

  console.log("Fetched submissions:", submissions.length)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Faculty Submissions</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionsTable submissions={submissions} />
        </CardContent>
      </Card>
    </div>
  )
}
