import styled from "styled-components"
import { useState, useEffect, useContext } from "react"
import { FaRoute, FaMapMarkerAlt, FaHome, FaPhone, FaEnvelope, FaBookmark, FaClock, FaAccessibleIcon, FaHamburger, FaBicycle, FaUmbrellaBeach, FaWifi } from "react-icons/fa"
import { BsShareFill } from "react-icons/bs"
import Image from "next/image"
import media from "styled-media-query"
import { capitalizeFirstLetter } from "@/components/utils/capitalizeFirstLetter"
import { Button } from "@/styles/templates/button"
import Rating from "@/components/search/details/rating/rating"
import { fetchGET } from "@/components/utils/fetcher"

const md5 = require("md5")

const DetailsWrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 16px;
  bottom: 16px;
  z-index: 2;
  max-height: calc(100vh - 96px);
  overflow: auto;
  background-color: #fff;
  width: var(--sidebar-width);
  border: 0;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding-bottom: 1rem;
  overflow-x: hidden;
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
    position: absolute;
    border-radius: 0;
    top: 50px;
    left: 0; 
    max-height: 100%;
    overflow: hidden;
    width: 100%;
  `}
`

const ImageWrapper = styled.div`
  position: relative;
  display: block;
  width: var(--sidebar-width);
  height: 250px;
  width: 400px;
  ${media.lessThan("432px")`
  width: 100%

`}
`

const Header = styled.div`
  padding: 1rem 2rem;
  display: block;
  ${media.lessThan("432px")`
  `}
`

const Title = styled.h1`
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.75rem;
  margin-bottom: 1rem;
`

const SubTitle = styled.h2`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`

const Type = styled.p`
  font-weight: 400;
  color: var(--gray);
  font-size: 0.95rem;
  letter-spacing: 0.05rem;
`

const FeedbackContainer = styled.div`
  display: flex;
  margin-bottom: 0.75rem;

  ${media.lessThan("432px")`
  display: block;
  `}
`

const FeedbackWrapper = styled.button`
  background-color: var(--border-color);
  border: none;
  display: flex;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.75rem;
  transition: 0.2s;
  :hover {
    background: var(--body-bg);
  }
`

const FeedbackResult = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: ${(props) => (props.value > 85 ? "var(--success-color)" : "var(--failure-color)")};
`

const Actions = styled.div`
  display: flex;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
  ${media.lessThan("432px")`
  display: block;
  padding-top: 0;
  padding-bottom: 0;
  `}
`

const ActionsResponsiveContainer = styled.div`
  display: flex;
  align-items: center;
`

const ActionsWrapper = styled(Button)`
  background-color: var(--border-color);
  display: flex;
  border-radius: 50%;
  cursor: pointer;
  margin-left: var(--space-sm);
  margin-right: 0.5rem;
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
`

const WikipediaDataContainer = styled.div``

const WikipediaCredit = styled.div`
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 1rem;
`
const WikipediaLink = styled.a`
  border-bottom: 1px solid var(--secondary-color);
  :hover {
    border-bottom: none;
  }
`

const CloseDetailsContainer = styled.div`
  display: none;

  ${media.lessThan("416px")`
  position: absolute;
  bottom: -1.75rem;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  background: #fff;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  justify-content: center;
  :hover {
    border: 1px solid var(--secondary-color);
  }
`}
`

const InformationContainer = styled.div`
  margin: 1rem 2rem;
  align-items: center;
  border-top: 1px solid var(--border-color);
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

const PlaceholderImage = styled.div`
position: relative
  height: 250px;
  width: 400px;
`

const SwipeContainer = styled.div``

function Details({ result, name }) {
  const [image, setImage ] = useState()


  useEffect(() => {
    getImage(result)
  }, [result])


  async function getImage (result) {
    if (Object.keys(result).length > 0 && result.wikidata) {
      const wikidataEntity = result.wikidata.replace(/^.+:/, "") 
    const res = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${wikidataEntity}&format=json&origin=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const wikidata = await res.json()
    if (wikidata) {
      const imageName = wikidata.claims.P18[0].mainsnak.datavalue.value.replaceAll(" ", "_")
      const hash = md5(imageName)
      setImage(`https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash[0]}${hash[1]}/${imageName}`)
    } else {
      setImage("/assets/placeholder_image.jpg")
    }
  }
  
}

const renderImage = ()  => {
  if (image) {
  return (
  <ImageWrapper href={image}>
    <Image
      src={image}
      layout="fill"
      target="_blank"
      rel="nofollow noopener noreferrer"
      objectFit="cover"
      objectPosition="top"
      alt={`Image of ${result.display_name}`}
      title={`Image of ${result.display_name}`}
      priority={true}
    />
  </ImageWrapper>)}

    }
  const renderWikidata = (result) => {


    if (!result.summary || result.summary === 2) {
      return null
    }
    let text = `${result.summary.substr(0, result.summary.indexOf(". "))}.`
    if (text.length < 3) {
      text = result.summary
    }
    return (
      <WikipediaData>
        <SubTitle>Short Summary</SubTitle>
        <WikipediaDataContainer>{text}</WikipediaDataContainer>
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
      <DetailsWrapper>
        {renderImage()}
        <Header>
          {name ? <Title>{name}</Title> : null}
          <Rating result={result} />
          {result.type ? <Type>{capitalizeFirstLetter(result.type)}</Type> : null}
        </Header>
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
    )
  }
}

export default Details
