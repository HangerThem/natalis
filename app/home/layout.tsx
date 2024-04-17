"use client"

import { withAuth } from "@/hoc/withAuth"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default withAuth(AuthLayout)
