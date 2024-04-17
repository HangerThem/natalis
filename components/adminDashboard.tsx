"use client"

import { useAdmin } from "@/context/adminContext"
import EventList from "./eventList"

const AdminDashboard = () => {
  const { admin } = useAdmin()

  const timeOfDay = () => {
    const hours = new Date().getHours()

    if (hours < 12) {
      return "Good morning"
    } else if (hours < 18) {
      return "Good afternoon"
    } else {
      return "Good evening"
    }
  }

  return (
    <div>
      <h1>
        {timeOfDay()}, {admin?.username}
      </h1>
      <EventList />
    </div>
  )
}

export default AdminDashboard
