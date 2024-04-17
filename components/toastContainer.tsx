"use client"

import styled from "styled-components"
import { useToast } from "@/context/toastContext"
import {
  InfoCircle,
  XCircle,
  ExclamationTriangle,
  Check2Circle,
  X,
} from "react-bootstrap-icons"

const Container = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 9999;
`

const Toast = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background-color: #111;
  border: 1px solid #444;
  border-radius: 8px;
  width: 350px;
  color: #fff;
`

const ToastInfo = styled.div`
  display: flex;
  gap: 1rem;
`

const ToastTitle = styled.h1`
  font-size: 1rem;
  font-weight: 500;
`

const ToastMessage = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
`

const ToastClose = styled.button`
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: #fff;
  cursor: pointer;
`

const ToastIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ToastContainer = () => {
  const { toastNotifications, removeToastNotification } = useToast()

  const getIcon = (type: ToastNotification["type"]) => {
    const iconSize = 36
    switch (type) {
      case "info":
        return <InfoCircle size={iconSize} />
      case "error":
        return <XCircle size={iconSize} />
      case "warning":
        return <ExclamationTriangle size={iconSize} />
      case "success":
        return <Check2Circle size={iconSize} />
      default:
        return <InfoCircle size={iconSize} />
    }
  }

  return (
    <Container>
      {toastNotifications.map((toast) => (
        <Toast key={toast.id}>
          <ToastInfo>
            <ToastIcon>{getIcon(toast.type)}</ToastIcon>
            <div>
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastMessage>{toast.description}</ToastMessage>
            </div>
          </ToastInfo>
          <ToastClose onClick={() => removeToastNotification(toast.id)}>
            <X size={24} />
          </ToastClose>
        </Toast>
      ))}
    </Container>
  )
}

export default ToastContainer
