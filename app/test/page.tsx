"use client"

import styled from "styled-components"
import { MouseEvent, useState } from "react"
import Link from "next/link"

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  height: 100vh;
`

const Circle = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  width: 200px;
  height: 200px;
  top: ${(props) => props.$y}px;
  left: ${(props) => props.$x}px;
  border-radius: 50%;
  background-image: radial-gradient(circle, #333 0%, #000 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 0;
`

export const Side = styled(Link)`
  z-index: 1;
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const Divider = styled.div`
  width: 1px;
  height: 100%;
  background-color: #fff;
  z-index: 1;
`

export default function LandingPage() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent) => {
    const x = e.clientX
    const y = e.clientY
    setCursorPos({ x, y })
  }

  return (
    <Wrapper onMouseMove={handleMouseMove}>
      <Circle $x={cursorPos.x} $y={cursorPos.y} />
      <Side className="first" href={"/admin"}>
        <h1>Admin</h1>
      </Side>
      <Divider />
      <Side href={"/user"}>
        <h1>User</h1>
      </Side>
    </Wrapper>
  )
}
