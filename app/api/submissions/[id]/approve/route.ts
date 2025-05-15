import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ObjectId } from "mongodb"
import { UserRole } from "@/lib/types"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only HODs can approve submissions
    if (session.user.role !== UserRole.HOD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { db } = await connectToDatabase()

    const result = await db
      .collection("submissions")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { status: "approved", approvedBy: session.user.id, approvedDate: new Date().toISOString() } },
      )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error approving submission:", error)
    return NextResponse.json({ error: "Failed to approve submission" }, { status: 500 })
  }
}
