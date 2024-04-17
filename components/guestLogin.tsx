"use client"

import styled from "styled-components"
import { useState, FormEvent } from "react"
import { codeRegex } from "@/constants/codeRegex"
import { useAuthContext } from "@/context/authContext"
import Button from "@/components/button"
import {
  Container,
  Form,
  FormTitle,
  FormSubtitle,
  FormField,
  Label,
  Input,
  FormError,
} from "@/components/FormElements"

const GuestLogin = () => {
  const [code, setCode] = useState<string>()
  const [error, setError] = useState<any>()
  const { login } = useAuthContext()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!code) return
    const response = await login(code)
    if (response?.invalidCode) {
      setError("Invalid code")
    } else if (response?.userNotFound) {
      setError("User not found")
    }
  }

  const handleCodeChange = (e: any) => {
    setCode(e.target.value)
    setError(undefined)
  }

  return (
    <Container>
      <Form onSubmit={(e) => handleLogin(e)}>
        <FormTitle>Login</FormTitle>
        <FormSubtitle>- Use the code you received to login -</FormSubtitle>
        <FormField>
          <Label htmlFor="code" className={error ? "error" : ""}>
            Code
          </Label>
          <Input
            id="code"
            type="text"
            placeholder="A247-3B8C-4D6F-5E9A"
            value={code}
            className={(code ? "filled" : "") + " " + (error ? "error" : "")}
            onChange={(e) => handleCodeChange(e)}
          />
          {error && <FormError>{error}</FormError>}
        </FormField>
        <Button
          type="submit"
          disabled={!code || !codeRegex.test(code)}
          className="full-width"
        >
          Login
        </Button>
      </Form>
    </Container>
  )
}

export default GuestLogin
