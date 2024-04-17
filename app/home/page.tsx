"use client"

import { useAuthContext } from "@/context/authContext"

export default function Home() {
  const { logout } = useAuthContext()
  return (
    <div>
      <h1>Home</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
