"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import crypto from "crypto"
import { useRouter } from "next/navigation"
import { useToast } from "./toastContext"

interface AuthContextProps {
  loading: boolean
  token: string | undefined
  refreshToken: string | undefined
  user: any
  login: (code: string) => Promise<LoginResponse>
  logout: () => void
  refreshTokens: () => void
}

interface AuthProviderProps {
  children: React.ReactNode
}

type LoginResponse = {
  userNotFound: boolean
  invalidCode: boolean
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

/**
 * Provides authentication and user management functionality for the application.
 * @component
 * @param {AuthProviderProps} props - The props for the component.
 * @returns {React.ReactElement}
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter()
  const [token, setToken] = useState<string | undefined>()
  const [refreshToken, setRefreshToken] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<any>()
  const { addToastNotification } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("natalisToken")
    const refreshToken = localStorage.getItem("natalisRefreshToken")
    if (token && refreshToken) {
      setToken(token)
      setRefreshToken(refreshToken)
    }
    setLoading(false)
  }, [])

  /**
   * Logs in the admin user with the provided username and password.
   * @param {string} code - The code to log in with.
   * @returns {Promise<LoginResponse>} The response from the login attempt.
   */
  const login = async (code: string): Promise<LoginResponse> => {
    const response: LoginResponse = {
      userNotFound: false,
      invalidCode: false,
    }
    if (!code) {
      response.invalidCode = true
      return response
    }
    await fetch("/api/v1/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then(async (res: Response) => {
        if (res.status === 400) {
          response.invalidCode = true
          throw new Error("Invalid code")
        }
        if (res.status === 404) {
          response.userNotFound = true
          throw new Error("User not found")
        }
        if (res.status === 500) {
          addToastNotification({
            type: "error",
            title: "Server error",
            description: "Please try again later",
          })
          throw new Error("Server error")
        }
        if (res.status === 200) {
          return res.json()
        }
      })
      .then((res) => {
        const { token, refreshToken } = res
        setToken(token)
        setRefreshToken(refreshToken)
        localStorage.setItem("natalisToken", token)
        localStorage.setItem("natalisRefreshToken", refreshToken)
        router.push("/home")
      })
      .catch((err) => {
        console.error(err)
      })
    return response
  }

  /**
   * Logs out the user by removing the tokens from the state and local storage.
   * @returns {void}
   */
  const logout = (): void => {
    setToken(undefined)
    setRefreshToken(undefined)
    localStorage.removeItem("natalisToken")
    localStorage.removeItem("natalisRefreshToken")
  }

  /**
   * Refreshes the access token using the refresh token.
   * If the refresh token is not available, the function returns early.
   * If the response status is 400, an error is thrown indicating an invalid refresh token.
   * If the response is successful, the tokens are updated in the state and stored in the local storage.
   * If there is an error, the user is logged out.
   * @returns {Promise<void>}
   */
  const refreshTokens = async (): Promise<void> => {
    await fetch("/api/v1/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    })
      .then((res: Response) => {
        if (res.status === 400) {
          throw new Error("Invalid refresh token")
        }
        return res.json()
      })
      .then((res) => {
        const { token, refreshToken } = res
        setToken(token)
        setRefreshToken(refreshToken)
        localStorage.setItem("natalisToken", token)
        localStorage.setItem("natalisRefreshToken", refreshToken)
      })
      .catch((err) => {
        console.error(err)
        logout()
      })
  }

  useEffect(() => {
    if (token) {
      fetch("/api/v1/guest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res: Response) => {
          if (res.status === 401) {
            refreshTokens()
            return
          }
          if (res.status === 400) {
            throw new Error("Invalid token")
          }
          if (res.status === 404) {
            throw new Error("User not found")
          }
          return res.json()
        })
        .then((res) => {
          setUser(res)
        })
        .catch((err) => {
          console.error(err)
          logout()
        })
    }
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        loading,
        token,
        refreshToken,
        user,
        login,
        logout,
        refreshTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to consume the AuthContext.
 * @returns {AuthContextProps} The context value.
 */
export const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider")
  }
  return context
}
