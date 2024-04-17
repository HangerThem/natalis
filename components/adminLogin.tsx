"use client"

import { useState, FormEvent } from "react"
import { useAdmin } from "@/context/adminContext"
import {
  Form,
  FormTitle,
  FormSubtitle,
  FormField,
  Label,
  Input,
  FormError,
} from "@/components/FormElements"
import Button from "@/components/button"

const AdminLogin = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { login } = useAdmin()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await login(username, password)
    if (response.invalidUsername) {
      setError("Invalid username")
    } else if (response.adminNotFound) {
      setError("Admin not found")
    }
  }

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value)
    setError(null)
  }

  return (
    <Form onSubmit={handleLogin}>
      <FormTitle>Admin</FormTitle>
      <FormSubtitle>- Admin login -</FormSubtitle>
      <FormField>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          name="username"
          required
          autoComplete="off"
          value={username}
          onChange={(e) => handleUsernameChange(e)}
          className={error ? "error" : ""}
        />
        {error && <FormError>{error}</FormError>}
      </FormField>
      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>
      <Button type="submit" className="full-width">
        Login
      </Button>
      {children}
    </Form>
  )
}

export default AdminLogin
