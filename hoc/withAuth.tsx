import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/authContext"

/**
 * Higher-order component that adds authentication logic to a wrapped component.
 * @param WrappedComponent - The component to be wrapped with authentication logic.
 * @returns The wrapped component with authentication logic.
 */
export function withAuth(WrappedComponent: any) {
  return function WithAuthComponent(props: any) {
    const router = useRouter()
    const { token, loading } = useAuthContext()

    useEffect(() => {
      if (!loading && !token) {
        router.push("/")
      }
    }, [loading, token])

    if (loading || !token) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}
