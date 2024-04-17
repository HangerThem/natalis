"use client"

import AdminNavbar from "@/components/adminNavbar"
import { withAuthAdmin } from "@/hoc/withAuthAdmin"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  )
}

export default withAuthAdmin(AuthLayout)
