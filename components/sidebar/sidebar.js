import React, { useCallback, useEffect, useState, useContext } from "react"
import styled from "styled-components"
import Logo from "@/components/logo/logo"
import { DrawShapes } from "@/components/draw"
import media from "styled-media-query"
import MapContext from "../map/mapContext"
import { ImCross } from "react-icons/im"

const SidebarContainer = styled.div`
  position: absolute;
  z-index: 4;
  background-color: var(--body-bg);
  width: calc(var(--sidebar-width) + 16px);
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

const CloseButton = styled(ImCross)`
  cursor: pointer;
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
function Sidebar({ visible }) {
  const [showSidebar, setShowSidebar] = useState(visible)
  const [layers, setLayers] = useState()

  const { map } = useContext(MapContext)

  useEffect(() => {
    setShowSidebar(visible)
  }, [visible])
  useEffect(() => {
    if (map) {
      setLayers(map.getLayers().getArray())
    }
  }, [map])

  const handleVisability = () => {
    showSidebar ? setShowSidebar(false) : setShowSidebar(true)
  }

  return (
    <>
      {showSidebar ? (
        <>
          <SidebarContainer>
            <Header>
              <Logo />
              <CloseButton onClick={handleVisability} title="Close menu">
                Close
              </CloseButton>
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
          <PageWrap onClick={handleVisability} />
        </>
      ) : null}
    </>
  )
}

export default Sidebar
