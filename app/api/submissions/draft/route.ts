import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get the most recent draft for the current user
    const draft = await db
      .collection("submissions")
      .findOne({ userId: session.user.id, status: "draft" }, { sort: { submittedDate: -1 } })

    if (!draft) {
      return NextResponse.json({ message: "No draft found" }, { status: 404 })
    }

    // Convert MongoDB _id to string id for client
    const draftWithStringId = {
      ...draft,
      id: draft._id.toString(),
      _id: undefined,
    }

    return NextResponse.json(draftWithStringId)
  } catch (error) {
    console.error("Error fetching draft:", error)
    return NextResponse.json({ error: "Failed to fetch draft" }, { status: 500 })
  }
}
