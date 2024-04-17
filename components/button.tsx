"use client"

import Link from "next/link"
import styled from "styled-components"

const zIndex = () => {
  const z = []
  for (let i = 0; i < 100; i++) {
    z.push(`&.z-${i} { z-index: ${i}; }`)
  }
  return z.join("\n")
}

const ButtonContainer = styled.button`
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border: #444 1px solid;
  background-color: transparent;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  outline: none;

  &.full-width {
    width: 100%;
  }

  &.danger {
    border-color: #f00;
    color: #f00;
  }

  &.solid {
    background: #fff;
    border-color: #fff;
    color: #000;
  }

  &:disabled {
    background: #333;
    color: #888;
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: #222;
  }

  &:active:not(:disabled) {
    background: #111;
  }

  &.danger:hover:not(:disabled) {
    background: #400;
  }

  &.danger:active:not(:disabled) {
    background: #200;
  }

  &.solid:hover:not(:disabled) {
    background: #eee;
    border-color: #eee;
  }

  &.solid:active:not(:disabled) {
    background: #fff;
    border-color: #fff;
  }

  ${zIndex()}
`

interface ButtonProps {
  children: React.ReactNode
  link?: string
  type?: "button" | "submit" | "reset"
  onClick?: (arg0: any) => void
  disabled?: boolean
  className?: string
}

const Button = ({
  children,
  link,
  type = "button",
  onClick,
  disabled,
  className,
}: ButtonProps) => {
  if (link) {
    return (
      <Link href={link}>
        <ButtonContainer
          disabled={disabled}
          onClick={onClick}
          type={type}
          className={className}
        >
          {children}
        </ButtonContainer>
      </Link>
    )
  }
  return (
    <ButtonContainer
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </ButtonContainer>
  )
}

export default Button
