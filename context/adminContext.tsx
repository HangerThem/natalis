"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "./toastContext"

interface AdminContextProps {
  loading: boolean
  token: string | undefined
  refreshToken: string | undefined
  admin: {
    id: string
    username: string
  }
  login: (username: string, password: string) => Promise<LoginResponse>
  register: (
    username: string,
    password: string,
    passwordConfirm: string
  ) => Promise<RegisterResponse>
  logout: () => void
  refreshTokens: () => Promise<void>
}

interface AdminProviderProps {
  children: React.ReactNode
}

type LoginResponse = {
  adminNotFound: boolean
  invalidUsername: boolean
}

type RegisterResponse = {
  adminAlreadyExists: boolean
  passwordMismatch: boolean
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined)

/**
 * Provides authentication and user management functionality for the admin dashboard.
 * @component
 * @param {AdminProviderProps} props - The props for the component.
 * @returns {React.ReactElement}
 */
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const router = useRouter()
  const [token, setToken] = useState<string | undefined>()
  const [refreshToken, setRefreshToken] = useState<string | undefined>()
  const [admin, setAdmin] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const { addToastNotification } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("natalisAdminToken")
    const refreshToken = localStorage.getItem("natalisAdminRefreshToken")
    if (token && refreshToken) {
      setToken(token)
      setRefreshToken(refreshToken)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      setLoading(true)
      getAdmin()
    }
  }, [token])

  /**
   * Logs in the admin user with the provided username and password.
   * @param {string} username - The username of the admin user.
   * @param {string} password - The password of the admin user.
   * @returns {Promise<LoginResponse>} A promise that resolves to the login response.
   */
  const login = async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    let response: LoginResponse = {
      adminNotFound: false,
      invalidUsername: false,
    }
    if (!username || !password) {
      response.invalidUsername = true
      return response
    }
    await fetch("/api/v1/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res: Response) => {
        if (res.status === 401) {
          refreshTokens()
          throw new Error("Unauthorized")
        }
        if (res.status === 400) {
          throw new Error("Invalid token")
        }
        if (res.status === 404) {
          response.adminNotFound = true
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
        return res.json()
      })
      .then(async (res) => {
        const { token, refreshToken } = res
        setToken(token)
        setRefreshToken(refreshToken)
        await getAdmin()
        addToastNotification({
          type: "success",
          title: "Welcome back!",
          description: "You have successfully logged in",
        })
        localStorage.setItem("natalisAdminToken", token)
        localStorage.setItem("natalisAdminRefreshToken", refreshToken)
        router.push("/admin/dashboard")
      })
      .catch((err) => {
        console.error(err)
      })
    return response
  }

  /**
   * Logs out the admin user by clearing the token and refresh token from state
   * and removing them from local storage.
   * @returns {void}
   */
  const logout = (): void => {
    setToken(undefined)
    setRefreshToken(undefined)
    localStorage.removeItem("natalisAdminToken")
    localStorage.removeItem("natalisAdminRefreshToken")
  }

  /**
   * Fetches the admin data from the API and updates the state with the response.
   * Displays a toast notification upon successful login.
   * @returns {Promise<void>}
   */
  const getAdmin = async (): Promise<void> => {
    await fetch("/api/v1/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res: Response) => {
        if (res.status === 401) {
          await refreshTokens()
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
        setAdmin(res)
      })
      .catch((err) => {
        console.error(err)
      })
    setLoading(false)
  }

  /**
   * Registers a new admin user.
   * @param {string} username - The username of the admin user.
   * @param {string} password - The password of the admin user.
   * @param {string} passwordConfirm - The confirmation password of the admin user.
   * @returns {Promise<RegisterResponse>} A promise that resolves to a RegisterResponse object.
   */
  const register = async (
    username: string,
    password: string,
    passwordConfirm: string
  ): Promise<RegisterResponse> => {
    let response: RegisterResponse = {
      adminAlreadyExists: false,
      passwordMismatch: false,
    }
    if (password !== passwordConfirm) {
      response.passwordMismatch = true
      return response
    }
    await fetch("/api/v1/admin/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, passwordConfirm }),
    })
      .then((res: Response) => {
        if (res.status === 400) {
          throw new Error("Invalid request")
        }
        if (res.status === 401) {
          response.passwordMismatch = true
          throw new Error("Password mismatch")
        }
        if (res.status === 409) {
          response.adminAlreadyExists = true
          throw new Error("User already exists")
        }
        return res.json()
      })
      .then(async (res) => {
        const { token, refreshToken } = res
        setToken(token)
        setRefreshToken(refreshToken)
        await getAdmin()
        addToastNotification({
          type: "success",
          title: "Welcome!",
          description: "You have successfully registered",
        })
        localStorage.setItem("natalisAdminToken", token)
        localStorage.setItem("natalisAdminRefreshToken", refreshToken)
        router.push("/admin/dashboard")
      })
      .catch((err) => {
        console.error(err)
      })
    return response
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
    if (!refreshToken) {
      return
    }
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
        localStorage.setItem("natalisAdminToken", token)
        localStorage.setItem("natalisAdminRefreshToken", refreshToken)
      })
      .catch((err) => {
        console.error(err)
        logout()
      })
  }

  return (
    <AdminContext.Provider
      value={{
        loading,
        token,
        refreshToken,
        admin,
        login,
        register,
        logout,
        refreshTokens,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

/**
 * Custom hook to consume the AdminContext.
 * @returns {AdminContextProps} The context value.
 */
export const useAdmin = (): AdminContextProps => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within a AdminProvider")
  }
  return context
}
