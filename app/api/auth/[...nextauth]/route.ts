import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/mongodb"
import { compare } from "bcryptjs"
import type { UserRole } from "@/lib/types"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Connect to MongoDB
          const { db } = await connectToDatabase()

          // Find user by email
          const user = await db.collection("users").findOne({ email: credentials.email })

          if (!user) {
            console.log("User not found")
            return null
          }

          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("Invalid password")
            return null
          }

          // Return user data
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role as UserRole
        session.user.department = token.department
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
