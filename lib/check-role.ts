// This is based on the uploaded file content
export function checkRole(allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    // Get the user from the request (added by auth middleware)
    const user = req.user

    // If no user or no role, deny access
    if (!user || !user.role) {
      return res.status(403).json({ message: "Access Denied: No user role found" })
    }

    // Check if the user's role is in the allowed roles
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient permissions" })
    }

    // If the role is allowed, continue to the next middleware/route handler
    next()
  }
}

// Example usage in a route:
// app.get("/api/faculty-data", authMiddleware, checkRole(["hod"]), getAllFacultyData);
