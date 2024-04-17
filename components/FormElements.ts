"use client"

import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background-color: #111;
  border: 1px solid #444;
  border-radius: 8px;
  width: 350px;
`

export const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
`

export const FormSubtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: #888;
`

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  width: 100%;
  margin-bottom: 0.5rem;
`

export const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 400;
  position: absolute;
  z-index: 1;
  top: -0.5rem;
  left: 0.5rem;
  background: #111;
  padding-inline: 0.25rem;
  transition: color 0.2s ease;

  &.error {
    color: #f00;
  }
`

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #444;
  background-color: transparent;
  border-radius: 4px;
  outline: none;
  font-size: 0.8rem;
  color: #fff;
  transition: border-color 0.2s ease;
  width: 100%;

  &.visibility-toggle {
    padding-right: 2rem;
  }

  &:focus,
  &.filled {
    border-color: #999;
  }

  &.error {
    border-color: #f00 !important;
  }
`

export const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #444;
  background-color: transparent;
  border-radius: 4px;
  outline: none;
  color: #fff;
  transition: border-color 0.2s ease;
  width: 100%;
  resize: vertical;
  max-height: 200px;
  min-height: 100px;
  font-size: 0.8rem;
  font-family: inherit;
  scrollbar-color: inherit;
  scrollbar-width: inherit;

  &:focus,
  &.filled {
    border-color: #999;
  }

  &.error {
    border-color: #f00 !important;
  }
`

export const FormError = styled.p`
  font-size: 0.7rem;
  font-weight: 400;
  color: #f00;
  position: absolute;
  z-index: 1;
  top: 2.25rem;
  left: 0.25rem;
`

export const PasswordVisibility = styled.div`
  position: absolute;
  z-index: 1;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-40%);
  cursor: pointer;
`

export const PasswordStrength = styled.div<{ $strength: number }>`
  width: 100%;
  height: 0.5rem;
  border-radius: 4px;
  background-color: #444;
  position: relative;
  margin-bottom: 0.5rem;

  &::before {
    content: "";
    position: absolute;
    width: ${({ $strength }) => `${$strength}%`};
    transition: width 0.2s ease, background 0.2s ease;
    height: 100%;
    border-radius: 4px;
    background-color: ${({ $strength }) => {
      if ($strength < 25) return "#f00"
      if ($strength < 50) return "#f90"
      if ($strength < 75) return "#ff0"
      return "#0f0"
    }};
  }
`
