"use client"

import styled from "styled-components"
import Button from "./button"

interface ErrorProps {
  statusCode: number
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  height: calc(100vh - 60px);
`

const Container = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
`

const Separator = styled.div`
  width: 1px;
  height: 100%;
  background: #444;
`

const Error = ({ statusCode }: ErrorProps) => {
  const getErrorMessage = (statusCode: number) => {
    switch (statusCode) {
      case 400:
        return "Bad request"
      case 401:
        return "Unauthorized"
      case 404:
        return "Page not found"
      case 500:
        return "Internal server error"
      default:
        return "An error occurred"
    }
  }

  return (
    <Wrapper>
      <Container>
        <h1>{statusCode}</h1>
        <Separator />
        <p>{getErrorMessage(statusCode)}</p>
      </Container>
      <Button onClick={() => window.history.back()}>Go back</Button>
    </Wrapper>
  )
}

export default Error
