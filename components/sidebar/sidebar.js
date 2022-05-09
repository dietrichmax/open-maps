import React, { useState } from "react"
import styled from "styled-components"
import Logo from "@/components/logo/logo"
//import { OutsideAlerter } from "@/components/hooks/clickOutsideAlerter"
import BurgerIcon from "./burgerIcon"
import { DrawShapes } from "@/components/draw"
import media from "styled-media-query"
import AutoComplete from "@/components/search/autocomplete"

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  margin: var(--space-sm);
  padding: var(--space-sm);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: var(--body-bg);
  display: flex;
  align-items: center;
  width: 400px;
  ${media.lessThan("416px")`
    margin: 0;
    width: 100%;
  `}
`

const SidebarContainer = styled.div`
  position: absolute;
  z-index: 2;
  background-color: var(--body-bg);
  width: 350px;
  height: 100vh;
`

const PageWrap = styled.div`
  position: absolute;
  z-index: 1;
  height: 100%;
  width: 100%;
  opacity: 0.3;
  background: black;
`

const CloseButton = styled.button`
  ::after { content: "\2714"; }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 1rem 0 1rem 0;
`
const SectionHeader = styled.p`
  margin-bottom: 0.5rem;
  text-decoration: underline;
`

const SectionItem = styled.li`
  padding: 4px 0;
  list-style: none;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`

const Section = styled.div`
  border-top: 1px solid #d9d9d9;
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 1rem 0;
`

const ButtonWrapper = styled.div``

const InfoSection = styled.div`
  border-top: 1px solid #d9d9d9;
  margin-top: auto;
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 1rem 0;
`

const InfoLinks = styled.a`
  color: var(--text-color);
  border-bottom: 1px solid var(--secondary-color);
  cursor: pointer;
  font-size: 0.75rem;
  margin-right: 1rem;
  :hover {
    border-bottom: none;
  }
`

function Sidebar() {
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    visible ? setVisible(false) : setVisible(true)
  }

  return (
    <>
      {visible ? (
        <>
          <SidebarContainer>
            <Header>
              <Logo />
              <CloseButton onClick={handleClick}>Close</CloseButton>
            </Header>
            <Section>
              <SectionHeader>Draw Options</SectionHeader>
              <SectionItem onClick={DrawShapes("Square")}>
                Rectangles{" "}
              </SectionItem>
              <SectionItem>Point</SectionItem>
              <SectionItem onClick={DrawShapes("Box")}>Polygon</SectionItem>
            </Section>
            <Section>
              <SectionItem>Share Map</SectionItem>
              <SectionItem>Embed Map</SectionItem>
              <SectionItem>Print Map</SectionItem>
            </Section>
            <Section>
              <SectionHeader>Improve this map</SectionHeader>
              <SectionItem>OpenStreetMap</SectionItem>
            </Section>
            <InfoSection>
              <InfoLinks title="Privacy" href="https://mxd.codes/privacy">
                Privacy
              </InfoLinks>
              <InfoLinks
                title="Site Notice"
                href="https://mxd.codes/site-notice"
              >
                Site-Notice
              </InfoLinks>
            </InfoSection>
          </SidebarContainer>
          <PageWrap onClick={handleClick} />
        </>
      ) : null}
      <Container>
        <ButtonWrapper onClick={handleClick}>
          <BurgerIcon />
        </ButtonWrapper>
        <AutoComplete />
      </Container>
    </>
  )
}

export default Sidebar
