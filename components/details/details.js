import ReactDOM from "react-dom"
import { useRef } from "react"
import styled from "styled-components"
import { useState, useEffect } from "react"
import { FaRoute, FaMapMarkerAlt, FaHome, FaPhone, FaEnvelope, FaBookmark, FaClock, FaAccessibleIcon, FaHamburger, FaBicycle, FaUmbrellaBeach, FaWifi } from "react-icons/fa"
import { BsShareFill } from "react-icons/bs"
import Image from "next/image"
import media from "styled-media-query"
import { capitalizeFirstLetter } from "@/components/utils/capitalizeFirstLetter"
import { Button } from "@/styles/templates/button"
import Rating from "@components/details/rating/rating"
//mport SlidingUpPanel from 'rn-sliding-up-panel';
const md5 = require("md5")

const DetailsContainer = styled.div``

const DetailsWrapper = styled.div`
  display: block;
  position: relative;
  top: var(--space);
  left: 16px;
  z-index: 2;
  max-height: calc(100vh - (65px + 3 * 16px));
  background-color: #fff;
  width: var(--sidebar-width);
  border: 0;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding-bottom: var(--space-sm);
  margin-bottom: var(--space-sm);
  overflow-x: hidden;
  overflow: auto;
  border-radius: var(--border-radius);
  animation: appear 600ms forwards;
  transform: translate3d(0px, 0px, 0px)
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: var(--body-bg);
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--gray);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: var(--gray);
  }
  ${media.lessThan("432px")`  
    display: flex;
    margin-bottom: 0;
    flex-direction: column;
    position: absolute;
    border-radius: 0;
    top: auto;
    left: 0;     
    width: 100%;
    max-height: calc(100vh - 64px);
    transform:  ${(props) => (props.height ? `translate3d(0px, ${props.height}px, 0px)` : "translate3d(0px, 150px, 0px)")};
    transition: ${(props) => (!props.isControlled ? `0.5s` : `none`)};    
    overflow: unset;
    bottom: 0;
  `}
`

const ImageWrapper = styled.div`
  position: relative;
  display: block;
  border-radius: var(--border-radius);
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  width: var(--sidebar-width);
  height: 250px;
  width: 400px;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
  ${media.lessThan("432px")`
    border-radius: 0;
    order: 1;
    min-height: 200px;
  `}
`

const Header = styled.div`
  margin: var(--space-sm) var(--space);
  display: block;
  ${media.lessThan("432px")`
  `}
`

const Title = styled.h1`
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.75rem;
  margin-bottom: 0.25rem;
`

const SubTitle = styled.h2`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0;
  line-height: 1.5rem;
`

const Type = styled.p`
  font-weight: 400;
  color: var(--gray);
  font-size: 0.95rem;
  letter-spacing: 0.05rem;
`

const Actions = styled.div`
  display: flex;
  margin: 1rem 2rem;
  justify-content: space-between;
  ${media.lessThan("432px")`
  
  order: 2;
  margin-top: var(--space-sm);
  display: block;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
  `}
`

const ActionsResponsiveContainer = styled.div`
  display: flex;
  align-items: center;
`

const ActionsWrapper = styled(Button)`
  border: 1px solid var(--border-color);
  display: flex;
  border-radius: 50%;
  cursor: pointer;
  margin-left: var(--space-sm);
  padding: 0.75rem;
  align-items: center;
  :hover {
    background: var(--body-bg);
  }
  ${media.lessThan("432px")`
    margin-left: 0;
    margin-bottom: 0;
    margin-right: var(--space-sm);
`}
`

const DirectionsButton = styled(Button)`
  display: flex;
  border-radius: var(--border-radius);
  margin-right: 0.5rem;
  padding: 0.75rem;
  min-width: 200px;
  justify-content: center;
  color: var(--body-bg);
  background-color: var(--secondary-color);
  :hover {
    opacity: 0.8;
  }
  ${media.lessThan("432px")`
    margin-bottom: 1rem;
    min-width: 100%;
`}
`

const WikipediaData = styled.div`
  padding: 0 2rem 0 2rem;
  background-color: #fff;
  order: 3;
`

const WikipediaDataContainer = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.25rem;
`

const WikipediaCredit = styled.div`
  padding: 1rem 2rem 0 2rem;
  background-color: #fff;
  order: 4;
`
const WikipediaLink = styled.a`
  font-size: 0.875rem;
  border-bottom: 1px solid var(--secondary-color);
  :hover {
    border-bottom: none;
  }
`

const InformationContainer = styled.div`
  padding: 0 2rem;
  margin-top: var(--space-sm);
  align-items: center;
  border-top: 1px solid var(--border-color);
  order: 5;
  background-color: #fff;
  height: 100%;
`

const InformationIconWrapper = styled(Button)`
  padding-left: 0;
  color: var(--secondary-color);
  font-size: 18px;
  cursor: auto;
`

const InformationItem = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
`

const InformationDetails = styled.div`
  display: block;
`

const InformationDetailsTitle = styled.h4`
  font-size: 0.75rem;
  color: #59595f;
  font-weight: normal;
`

const InformationDetailsValue = styled.a`
  font-size: 0.85rem;
`

const InformationWebsiteLink = styled.a`
  font-size: 0.85rem;
  color: var(--secondary-color);
  :hover {
    border-bottom: 1px solid var(--secondary-color);
  }
`

const PanelDrawer = styled.div`
  min-height: 20px;
  height: 20px;
  cursor: grab;
  width: 100%;
  border-radius: var(--border-radius);
  padding-top: 2px;
`

const PanelHandler = styled.div`
  width: 40px;
  height: 5px;
  margin: 4px auto;
  border-radius: 2.5px;
  background-color: var(--border-color);
`

function Details({ result, name }) {
  const [image, setImage] = useState()
  const [isMobileSize, setIsMobileSize] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isControlled, setIsControlled] = useState(true)
  const [deviceHeight, setDeviceHeight] = useState()
  const statusBarHeight = 55
  const draggableRange = {
    top: deviceHeight - statusBarHeight,
    bottom: deviceHeight - statusBarHeight - 110,
  }
  const transformTypes = ["transform", "-ms-transform", "-webkit-transform", "moz-transform", "-o-transform"]
  const releaseEvents = ["mouseup", "touchend"]
  const hotspotEvents = ["mousemove", "touchmove", "touchstart"]
  const elemRef = useRef()
  const dragProps = useRef()

  const initialiseDrag = (event) => {
    const clientY = isMobileDevice ? event.touches[0].pageY : event.clientY
    const { target,  } = isMobileDevice ? event.touches[0].pageY : event
    const { offsetTop } = target
    const { top } = elemRef.current.getBoundingClientRect()

    dragProps.current = {
      dragStartTop: top - offsetTop,
      dragStartY: clientY,
    }
    hotspotEvents.forEach(function (event) {
      window.addEventListener(event, startDragging, false)
    })
    releaseEvents.forEach(function (event) {
      window.addEventListener(event, stopDragging, false)
    })
  }

  const startDragging = ({ clientY }) => {
    setIsControlled(true)
    if (dragProps.current.dragStartTop + clientY - dragProps.current.dragStartY < 0) {
      transformTypes.forEach((transform) => {
        elemRef.current.style[transform] = `translate3d(0px, 0px, 0px)`
      })
    } else if (dragProps.current.dragStartTop + clientY - dragProps.current.dragStartY > draggableRange.bottom) {
      transformTypes.forEach((transform) => {
        elemRef.current.style[transform] = `translate3d(0px, ${draggableRange.bottom}px, 0px)`
      })
    } else {
      transformTypes.forEach((transform) => {
        elemRef.current.style[transform] = `translate3d(0px, ${dragProps.current.dragStartTop + clientY - dragProps.current.dragStartY}px, 0px)`
      })
    }
  }

  const stopDragging = ({ clientY }) => {
    setIsControlled(false)
    if (dragProps.current.dragStartTop + clientY - dragProps.current.dragStartY > 400) {
      transformTypes.forEach((transform) => {
        elemRef.current.style[transform] = `translate3d(0px, ${draggableRange.bottom}px, 0px)`
      })
      elemRef.current.style["overflow-y"] = "unset"
      elemRef.current.style["overflow-x"] = "unset"
    } else {
      transformTypes.forEach((transform) => {
        elemRef.current.style[transform] = `translate3d(0px, 0px, 0px)`
      })
      elemRef.current.style["overflow-y"] = "auto"
      elemRef.current.style["overflow-x"] = "inherit"
    }
    hotspotEvents.forEach(function (event) {
      window.removeEventListener(event, startDragging, false)
    })
    releaseEvents.forEach(function (event) {
      window.removeEventListener(event, stopDragging, false)
    })
  }

  const resize = () => {
    setDeviceHeight(window.innerHeight)
    if (window.innerWidth <= 432) {
      setIsMobileSize(true)
    } else {
      setIsMobileSize(false)
    }
  }

  useEffect(() => {
    setDeviceHeight(window.innerHeight)
    setIsMobileDevice(navigator.userAgentData.mobile)
    if (window.innerWidth <= 432) {
      setIsMobileSize(true)
    }
    window.addEventListener("resize", resize)
  }, [])

  useEffect(() => {
    setImage("")
    getImage(result)
  }, [result])

  async function getImage(result) {
    if (Object.keys(result).length > 0 && result.wikidata) {
      const wikidataEntity = result.wikidata.replace(/^.+:/, "")
      const res = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${wikidataEntity}&format=json&origin=*`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const wikidata = await res.json()
      if (wikidata && wikidata.claims.P18) {
        const imageName = wikidata.claims.P18[0].mainsnak.datavalue.value.replaceAll(" ", "_")
        const hash = md5(imageName)
        setImage(`https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash[0]}${hash[1]}/${imageName}`)
      }
    } else {
      setImage("/assets/placeholder_image.jpg")
    }
  }

  const renderWikidata = (result) => {
    if (!result.summary || result.summary === 2) {
      return null
    }
    return (
      <WikipediaData>
        <SubTitle>Short Summary</SubTitle>
        <WikipediaDataContainer>{result.summary}</WikipediaDataContainer>
      </WikipediaData>
    )
  }

  const renderAdress = (result) => {
    if (!result.address) {
      return null
    }
    const address = result.address
    return (
      <div>
        {address.street ? `${address.street}, ` : address.road ? `${address.road}, ` : null}
        {address.house_number ? ` ${address.house_number}, ` : null}
        {address.postcode ? ` ${address.postcode} ` : null}
        {address.city ? ` ${address.city}, ` : address.village ? ` ${address.village}, ` : address.town ? ` ${address.town}, ` : null}
        {address.country ? `${address.country}` : null}
      </div>
    )
  }

  if (result.length === 0) {
    return null
  } else {
    return (
      <DetailsContainer>
        <DetailsWrapper onTouchStart={initialiseDrag} onMouseDown={initialiseDrag} ref={elemRef} isControlled={isControlled} height={draggableRange.bottom}>
          {isMobileSize ? (
            <PanelDrawer>
              <PanelHandler />
            </PanelDrawer>
          ) : null}
          <ImageWrapper>
            {image ? (
              <Image
                src={image}
                layout="fill"
                target="_blank"
                rel="nofollow noopener noreferrer"
                href={image}
                objectFit="cover"
                objectPosition="top"
                alt={`Image of ${result.display_name}`}
                title={`Image of ${result.display_name}`}
                priority={true}
              />
            ) : null}
          </ImageWrapper>
          <Header>
            {name ? <Title>{name}</Title> : null}
            {result.type ? <Type>{capitalizeFirstLetter(result.type)}</Type> : null}
          </Header>
          <Rating result={result} />
          <Actions>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=&destination=${encodeURI(result.display_name)}&travelmode=driving`} //&dir_action=navigate
              target="_blank"
              rel="noopener noreferrer"
            >
              <DirectionsButton title="Get directions to this place">
                <FaRoute style={{ marginRight: ".5rem" }} />
                Directions
              </DirectionsButton>
            </a>
            <ActionsResponsiveContainer>
              <ActionsWrapper title="Save this place">
                <FaBookmark />
              </ActionsWrapper>
              <ActionsWrapper title="Share this place">
                <BsShareFill />
              </ActionsWrapper>
            </ActionsResponsiveContainer>
          </Actions>
          {renderWikidata(result)}
          {result.wikipediaLink ? (
            <WikipediaCredit>
              <WikipediaLink
                title={`https://${result.wikipediaLang}.wikipedia.org/wiki/${result.wikipediaLink}`}
                href={`https://${result.wikipediaLang}.wikipedia.org/wiki/${result.wikipediaLink}`}
              >
                {`https://${result.wikipediaLang}.wikipedia.org/wiki/${result.wikipediaLink}`}
              </WikipediaLink>{" "}
            </WikipediaCredit>
          ) : null}
          {result.information || result.address ? (
            <InformationContainer>
              <SubTitle>Information</SubTitle>
              {result.address ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaMapMarkerAlt title="Address details" />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Address</InformationDetailsTitle>
                    <InformationDetailsValue>{renderAdress(result)}</InformationDetailsValue>
                  </InformationDetails>
                </InformationItem>
              ) : null}
              {result.information.opening_hours ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaClock title="Opening hours" />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Opening hours</InformationDetailsTitle>
                    <InformationDetailsValue>{result.information.opening_hours}</InformationDetailsValue>
                  </InformationDetails>
                </InformationItem>
              ) : null}
              {result.information.website ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaHome title="Website Link" />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Website</InformationDetailsTitle>
                    <InformationWebsiteLink href={result.information.website} title={result.information.website} alt={`Link to website of ${result.display_name}`}>
                      {result.information.website}
                    </InformationWebsiteLink>
                  </InformationDetails>
                </InformationItem>
              ) : null}
              {result.information.email ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaEnvelope />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>E-Mail</InformationDetailsTitle>
                    <InformationWebsiteLink title={result.information.email} alt={`Email address of ${result.name}`} href={`mailto:${result.information.email}`}>
                      {result.information.email}
                    </InformationWebsiteLink>
                  </InformationDetails>
                </InformationItem>
              ) : null}
              {result.information.phone ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaPhone title="Phone number" />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Phone</InformationDetailsTitle>
                    <InformationWebsiteLink title={result.information.phone} alt={`Phone number of ${result.name}`}>
                      {result.information.phone}
                    </InformationWebsiteLink>
                  </InformationDetails>
                </InformationItem>
              ) : null}
            </InformationContainer>
          ) : null}
          {Object.keys(result.details).length > 0 ? (
            <InformationContainer>
              <SubTitle>Details</SubTitle>
              {result.details.wheelchair ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaAccessibleIcon />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Wheelchair accessible</InformationDetailsTitle>

                    <InformationDetailsValue>{result.details.wheelchair}</InformationDetailsValue>
                  </InformationDetails>
                </InformationItem>
              ) : null}
              {result.details.takeaway ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaBicycle />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Takeaway</InformationDetailsTitle>
                    <InformationDetailsValue>{result.details.takeaway}</InformationDetailsValue>
                  </InformationDetails>
                </InformationItem>
              ) : null}
              {result.details.cuisine ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaHamburger />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Cuisine</InformationDetailsTitle>
                    <InformationDetailsValue>{result.details.cuisine.replaceAll("_", " ")}</InformationDetailsValue>
                  </InformationDetails>
                </InformationItem>
              ) : null}
              {result.details.outdoor_seating ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaUmbrellaBeach />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Outdoor seating</InformationDetailsTitle>
                    <InformationDetailsValue>{result.details.outdoor_seating}</InformationDetailsValue>
                  </InformationDetails>
                </InformationItem>
              ) : null}
              {result.details.internet_access ? (
                <InformationItem>
                  <InformationIconWrapper>
                    <FaWifi />
                  </InformationIconWrapper>
                  <InformationDetails>
                    <InformationDetailsTitle>Internet access</InformationDetailsTitle>
                    <InformationDetailsValue>{result.details.internet_access}</InformationDetailsValue>
                  </InformationDetails>
                </InformationItem>
              ) : null}
            </InformationContainer>
          ) : null}
        </DetailsWrapper>
      </DetailsContainer>
    )
  }
}

export default Details