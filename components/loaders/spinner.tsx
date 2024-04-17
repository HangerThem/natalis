"use client"

import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);

  .spinner {
    border: 4px solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const Spinner = () => {
  return (
    <Wrapper>
      <div className="spinner" />
    </Wrapper>
  )
}

export default Spinner
