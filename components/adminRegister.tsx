"use client"

import { useState, FormEvent } from "react"
import { useAdmin } from "@/context/adminContext"
import { calculatePasswordStrength } from "@/utils/passwordStrength"
import {
  Form,
  FormTitle,
  FormSubtitle,
  FormField,
  Label,
  Input,
  PasswordStrength,
  FormError,
} from "@/components/FormElements"
import Button from "@/components/button"

const AdminRegister = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const { register } = useAdmin()
  const [error, setError] = useState<{
    adminAlreadyExists: boolean
    passwordMismatch: boolean
  } | null>(null)

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await register(username, password, passwordConfirm)
    setError(response)
  }

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value)
    setError(null)
  }

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value)
    setError(null)
  }

  const handlePasswordConfirmChange = (e: any) => {
    setPasswordConfirm(e.target.value)
    setError(null)
  }

  return (
    <Form onSubmit={handleRegister}>
      <FormTitle>Register</FormTitle>
      <FormSubtitle>- Register a new account -</FormSubtitle>
      <FormField>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          name="username"
          required
          autoComplete="off"
          className={error?.adminAlreadyExists ? "error" : ""}
          value={username}
          onChange={(e) => handleUsernameChange(e)}
        />
        {error?.adminAlreadyExists && (
          <FormError>Admin already exists</FormError>
        )}
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
          className={error?.passwordMismatch ? "error" : ""}
          onChange={(e) => handlePasswordChange(e)}
        />
        {error?.passwordMismatch && (
          <FormError>Passwords do not match</FormError>
        )}
      </FormField>
      <PasswordStrength $strength={calculatePasswordStrength(password)} />
      <FormField>
        <Label htmlFor="password-confirm">Confirm Password</Label>
        <Input
          type="password"
          id="password-confirm"
          name="password-confirm"
          required
          autoComplete="off"
          value={passwordConfirm}
          className={error?.passwordMismatch ? "error" : ""}
          onChange={(e) => handlePasswordConfirmChange(e)}
        />
      </FormField>
      <Button type="submit" className="full-width">
        Register
      </Button>
      {children}
    </Form>
  )
}

export default AdminRegister
