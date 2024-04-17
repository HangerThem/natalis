"use client"

import { useEffect, useState } from "react"

/**
 * Returns the online status of the user.
 * @returns {boolean} The online status of the user.
 */
export const useOnlineStatus = (): boolean => {
  const [online, setOnline] = useState(
    typeof window !== "undefined" ? window.navigator.onLine : true
  )

  useEffect(() => {
    const handleStatusChange = () => {
      setOnline(navigator.onLine)
      console.log("Online status changed to", navigator.onLine)
    }

    window.addEventListener("online", handleStatusChange)
    window.addEventListener("offline", handleStatusChange)

    return () => {
      window.removeEventListener("online", handleStatusChange)
      window.removeEventListener("offline", handleStatusChange)
    }
  }, [])

  return online
}
