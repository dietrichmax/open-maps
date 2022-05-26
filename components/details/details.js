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

const DetailsContainer = styled.div`


`

const DetailsWrapper = styled.div`

  ::-webkit-scrollbar {
  width: 11px;
  }
  scrollbar-width: thin;
  scrollbar-color: var(--content-bg);
  }
  ::-webkit-scrollbar-track {
  background: var(--body-bg);
  }
  ::-webkit-scrollbar-thumb {
  background-color: var(--gray);
  border-radius: var(--border-radius);
  }

  display: block;
  position: relative;
  top: var(--space);
  left: 16px;
  z-index: 3;
  max-height: calc(100vh - (65px + 3 * 16px));
  background-color:var(--body-bg);
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
  transform: translate3d(0px, 0px, 0px);
  ${media.lessThan("432px")`  
    display: flex;
    margin-bottom: 0;
    flex-direction: column;
    border-radius: 0;
    top: 0;
    left: 0;     
    width: 100%;
    max-height: calc(100vh - 65px);
    transform:  ${(props) => (props.height ? `translate3d(0px, ${props.height}px, 0px)` : "translate3d(0px, 150px, 0px)")};
    transition: ${(props) => (!props.isControlled ? `0.5s` : `none`)};   
    ::-webkit-scrollbar {
      width: 6px;
      } 
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
  background-color:var(--body-bg);
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
  background-color:var(--body-bg);
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
  background-color:var(--body-bg);
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
  const hotspotEvents = ["mousemove", "touchmove"]
  const elemRef = useRef()
  const dragProps = useRef()

  const initialiseDrag = (event) => {
    const y = isMobileDevice ? event.touches[0].clientY : event.clientY
    const target = event.target
    const { offsetTop } = target
    const { top } = elemRef.current.getBoundingClientRect()

    dragProps.current = {
      dragStartTop: top - offsetTop,
      dragStartY: y
    }
    hotspotEvents.forEach(function (event) {
      window.addEventListener(event, startDragging, false)
    })
    releaseEvents.forEach(function (event) {
      window.addEventListener(event, stopDragging, false)
    })
  }

  const startDragging = (event) => {
    const y = isMobileDevice ? event.touches[0].clientY : event.clientY
    elemRef.current.style["overflow-y"] = "unset"
    elemRef.current.style["overflow-x"] = "unset"
    setIsControlled(true)
    if (dragProps.current.dragStartTop + y - dragProps.current.dragStartY < 0) {
      transformTypes.forEach((transform) => {
        elemRef.current.style[transform] = `translate3d(0px, 0px, 0px)`
      })
    } else if (dragProps.current.dragStartTop + y - dragProps.current.dragStartY > draggableRange.bottom) {
      transformTypes.forEach((transform) => {
        elemRef.current.style[transform] = `translate3d(0px, ${draggableRange.bottom}px, 0px)`
      })
    } else {
      transformTypes.forEach((transform) => {
        elemRef.current.style[transform] = `translate3d(0px, ${dragProps.current.dragStartTop + y - dragProps.current.dragStartY}px, 0px)`
      })
    }
  }

  const stopDragging = (event) => {
    const y = isMobileDevice ? event.changedTouches[0].clientY : event.clientY
    setIsControlled(false)
    if (dragProps.current.dragStartTop + y - dragProps.current.dragStartY > 350) {
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
      setIsMobileDevice(true)
      setIsMobileSize(true)
    } else {
      setIsMobileSize(false)
    }
  }

  const detectMob = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

  useEffect(() => {
    setDeviceHeight(window.innerHeight)
    setIsMobileDevice(detectMob())
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
