import { AdminProvider } from "@/context/adminContext"
import { EventProvider } from "@/context/eventConext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <EventProvider>{children}</EventProvider>
    </AdminProvider>
  )
}
