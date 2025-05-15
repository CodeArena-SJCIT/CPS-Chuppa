import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { School } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <School className="h-6 w-6" />
            <span>College CPS Portal</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Faculty Career Progression Scheme
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    A comprehensive system for faculty to track their academic achievements, research, and development
                    activities.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>CPS Form System</CardTitle>
                    <CardDescription>
                      Track your academic progress and development activities for career advancement.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center gap-4 rounded-md border p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <School className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Easy Submission</p>
                        <p className="text-sm text-gray-500">
                          Submit your achievements and activities through a simple multi-step form.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-md border p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-primary"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Automatic Point Calculation</p>
                        <p className="text-sm text-gray-500">
                          Points are automatically calculated based on your submissions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href="/login" className="w-full">
                      <Button className="w-full">Login to Continue</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
