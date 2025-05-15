import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { hash } from "bcryptjs"
import { UserRole } from "@/lib/types"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Clear existing users (optional - remove this if you want to keep existing users)
    await db.collection("users").deleteMany({})

    // Create HOD user
    const hodPassword = await hash("hod123", 12)
    await db.collection("users").insertOne({
      name: "Dr. Rajesh Kumar",
      email: "hod@example.com",
      password: hodPassword,
      role: UserRole.HOD,
      department: "Computer Science",
      createdAt: new Date().toISOString(),
    })

    // Create faculty user
    const facultyPassword = await hash("faculty123", 12)
    await db.collection("users").insertOne({
      name: "Dr. Priya Sharma",
      email: "faculty@example.com",
      password: facultyPassword,
      role: UserRole.FACULTY,
      department: "Computer Science",
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Users created successfully",
      credentials: [
        { role: "HOD", email: "hod@example.com", password: "hod123" },
        { role: "Faculty", email: "faculty@example.com", password: "faculty123" },
      ],
    })
  } catch (error) {
    console.error("Error seeding users:", error)
    return NextResponse.json({ error: "Failed to seed users" }, { status: 500 })
  }
}
