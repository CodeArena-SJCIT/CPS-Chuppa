import { connectToDatabase } from "./mongodb"
import { hash } from "bcryptjs"
import { UserRole } from "./types"

export async function seedUsers() {
  console.log("Seeding users...")
  const { db } = await connectToDatabase()

  // Check if users collection is empty
  const userCount = await db.collection("users").countDocuments()

  if (userCount === 0) {
    // Create default HOD
    const hodPassword = await hash("hod123", 12)
    await db.collection("users").insertOne({
      name: "Dr. Rajesh Kumar",
      email: "hod@college.edu",
      password: hodPassword,
      role: UserRole.HOD,
      department: "Computer Science",
      createdAt: new Date().toISOString(),
    })

    // Create default faculty members
    const facultyPassword = await hash("faculty123", 12)
    const facultyMembers = [
      {
        name: "Dr. Priya Sharma",
        email: "priya@college.edu",
        password: facultyPassword,
        role: UserRole.FACULTY,
        department: "Computer Science",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Prof. Anand Singh",
        email: "anand@college.edu",
        password: facultyPassword,
        role: UserRole.FACULTY,
        department: "Electronics",
        createdAt: new Date().toISOString(),
      },
    ]

    await db.collection("users").insertMany(facultyMembers)
    console.log("Default users created")
  } else {
    console.log("Users already exist, skipping seed")
  }
}
