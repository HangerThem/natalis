"use client"

import { useState } from "react"
import { Container } from "@/components/FormElements"
import Button from "@/components/button"
import AdminLogin from "@/components/adminLogin"
import AdminRegister from "@/components/adminRegister"

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <Container>
      {isRegistering ? (
        <AdminRegister>
          <Button
            type="button"
            onClick={() => setIsRegistering(false)}
            className="full-width"
          >
            Already have an account? Login
          </Button>
        </AdminRegister>
      ) : (
        <AdminLogin>
          <Button
            type="button"
            onClick={() => setIsRegistering(true)}
            className="full-width"
          >
            Don't have an account? Register
          </Button>
        </AdminLogin>
      )}
    </Container>
  )
}
