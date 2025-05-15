import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const submission = await db.collection("submissions").findOne({ _id: new ObjectId(params.id) })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    // Check if user is authorized to view this submission
    if (session.user.role !== "hod" && submission.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Error fetching submission:", error)
    return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only HODs can update submission status
    if (session.user.role !== "hod") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { status } = await req.json()

    const { db } = await connectToDatabase()
    const result = await db.collection("submissions").updateOne({ _id: new ObjectId(params.id) }, { $set: { status } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating submission:", error)
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 })
  }
}
