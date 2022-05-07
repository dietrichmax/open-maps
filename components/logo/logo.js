import React from "react"
import styled from "styled-components"
import Link from "next/link"

const LogoWrapper = styled.a`
  font-family: var(--primary-font);
  font-weight: 600;
`

const Subtitle = styled.span`
  font-family: var(--primary-font);
  font-weight: 400;
`

const Logo = () => {
  return (
    <LogoWrapper class="u-url" rel="me" title="Max Dietrich" href="/">
      <span>mxd.codes</span>
      <Subtitle> | Maps</Subtitle>
    </LogoWrapper>
  )
}
export default Logo
