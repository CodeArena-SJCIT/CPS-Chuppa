import type { UserRole } from "@/lib/types"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    role: UserRole
    department?: string
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    department?: string
  }
}
