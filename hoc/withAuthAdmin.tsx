import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/context/adminContext"

/**
 * Higher-order component that provides authentication for admin users.
 *
 * @param WrappedComponent - The component to be wrapped with authentication.
 * @returns The wrapped component with authentication.
 */
export function withAuthAdmin(WrappedComponent: any) {
  return function WithAuthComponent(props: any) {
    const router = useRouter()
    const { token, loading } = useAdmin()

    useEffect(() => {
      if (!loading && !token) {
        router.push("/admin")
      }
    }, [loading, token])

    if (loading || !token) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}
