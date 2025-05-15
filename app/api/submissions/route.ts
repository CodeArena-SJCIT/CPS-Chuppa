import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.json()

    // Add user ID and submission date if not already there
    const submission = {
      ...formData,
      userId: session.user.id,
      submittedDate: formData.submittedDate || new Date().toISOString(),
      status: formData.status || "pending",
    }

    const { db } = await connectToDatabase()

    let result
    // Update existing submission if ID is provided
    if (formData.id) {
      result = await db.collection("submissions").updateOne({ _id: new ObjectId(formData.id) }, { $set: submission })

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        submissionId: formData.id,
      })
    } else {
      // Insert new submission
      result = await db.collection("submissions").insertOne(submission)

      return NextResponse.json({
        success: true,
        submissionId: result.insertedId.toString(),
      })
    }
  } catch (error) {
    console.error("Error submitting form:", error)
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // HODs can see all submissions, faculty can only see their own
    let submissions
    if (session.user.role === "hod") {
      submissions = await db.collection("submissions").find({}).toArray()
    } else {
      submissions = await db.collection("submissions").find({ userId: session.user.id }).toArray()
    }

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}
