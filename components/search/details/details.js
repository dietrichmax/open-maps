import styled from "styled-components"
import { useState, useEffect } from "react"
import { config } from "config"
import {
  FaRoute,
  FaMapMarkerAlt,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaBookmark,
} from "react-icons/fa"
import { BsShareFill } from "react-icons/bs"
const md5 = require("md5")
import Image from "next/image"
import media from "styled-media-query"
import { capitalizeFirstLetter } from "@/components/utils/capitalizeFirstLetter"
import { Button } from "@/styles/templates/button"
import { fetchGET } from "@/components/utils/fetcher"
import Rating from "@/components/search/details/rating/rating"

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
    top: 48px;
    left: 0px;
    width: 100%;
    height: calc(100vh - 48px);
    border-radius: 0;
  `}
`

const ImageWrapper = styled.div`
  display: block;
  width: var(--sidebar-width);
  height: 250px;
  object-fit: cover;
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
  margin-bottom: 0.25rem;
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
  color: ${(props) =>
    props.value > 85 ? "var(--success-color)" : "var(--failure-color)"};
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
  font-size: 0.95rem;
`

const InformationWebsiteLink = styled.a`
  color: var(--secondary-color);
  :hover {
    border-bottom: 1px solid var(--secondary-color);
  }
`

function Details({ result, name }) {
  const [visible, setVisible] = useState(false)
  const [wikimediaImageUrl, setwikimediaImageUrl] = useState()
  const [wikipediaData, setWikipediaData] = useState(false)
  const [wikipediaLang, setWikipediaLang] = useState("en")

  useEffect(() => {
    getWikimediaImageUrl(result)
    getWikipediaData(result)
  }, [result])

  const renderImage = () => {
    if (!wikimediaImageUrl) {
      return null
    }
    return (
      <ImageWrapper>
        <a href={wikimediaImageUrl}>
          <Image
            src={
              wikimediaImageUrl
                ? wikimediaImageUrl
                : `https://source.unsplash.com/random/300×450/?${result.display_name}`
            }
            height="250"
            width="400"
            target="_blank"
            rel="nofollow noopener noreferrer"
            alt={
              wikimediaImageUrl
                ? `Image of ${result.display_name} from Wikimeda`
                : "Random image from Unsplash"
            }
            title={
              wikimediaImageUrl
                ? `Image of '${result.display_name}' from Wikimedia`
                : "Random image from Unsplash"
            }
          />
        </a>
      </ImageWrapper>
    )
  }

  const renderWikidata = () => {
    if (!wikipediaData || wikipediaData.length === 2) {
      return null
    }
    let text = `${wikipediaData.substr(0, wikipediaData.indexOf(". "))}.`
    if (text.length < 3) {
      text = wikipediaData
    }
    return (
      <WikipediaData>
        <SubTitle>Short Summary</SubTitle>
        <WikipediaDataContainer>{text}</WikipediaDataContainer>
      </WikipediaData>
    )
  }

  //getWikimediaImageUrl(result)
  async function getWikimediaImageUrl(result) {
    if (!result || !result.extratags) {
      setwikimediaImageUrl()
      return null
    }
    const data = await fetchGET(
      `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${result.extratags.wikidata}&origin=*&format=json`
    )
    let imageUrl
    if (data.claims && data.claims.P18) {
      const imageName = data.claims.P18[0].mainsnak.datavalue.value.replaceAll(
        " ",
        "_"
      )
      const hash = md5(imageName)
      imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash[0]}${hash[1]}/${imageName}`
    }

    setwikimediaImageUrl(imageUrl)
  }

  async function getWikipediaData(result) {
    if (!result || !result.extratags || !result.extratags.wikipedia) {
      setWikipediaData()
      return null
    }

    setWikipediaLang(
      result.extratags.wikipedia.substr(
        0,
        result.extratags.wikipedia.indexOf(":")
      )
    )
    const wikipedia = result.extratags.wikipedia.replace(/^.+:/, "")
    const data = await fetchGET(
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&continue=&format=json&formatversion=2&format=json&titles=${wikipedia}&origin=*`
    )
    if (!data.query.pages[0] || !data.query.pages[0].extract) return
    setWikipediaData(data.query.pages[0].extract.toString())
  }

  const renderAdress = (result) => {
    if (!result.address) {
      return null
    }
    const address = result.address
    return (
      <div>
        {address.street ? address.street : address.road ? address.road : null}
        {address.house_number ? ` ${address.house_number}, ` : null}
        {address.postcode ? ` ${address.postcode} ` : null}
        {address.city
          ? ` ${address.city}, `
          : address.village
          ? ` ${address.village}, `
          : address.town
          ? ` ${address.town}, `
          : null}
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
          {result.display_name ? <Title>{name}</Title> : null}
          <Rating result={result} />
          {result.type ? (
            <Type>{capitalizeFirstLetter(result.type)}</Type>
          ) : null}
        </Header>
        <Actions>
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=&destination=${encodeURI(
              result.display_name
            )}&travelmode=driving`} //&dir_action=navigate
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
        {renderWikidata()}
        {result.extratags.wikipedia ? (
          <WikipediaCredit>
            <WikipediaLink
              title={`https://${wikipediaLang}.wikipedia.org/wiki/${result.extratags.wikipedia}`}
              href={`https://${wikipediaLang}.wikipedia.org/wiki/${result.extratags.wikipedia}`}
            >
              {`https://${wikipediaLang}.wikipedia.org/wiki/${result.extratags.wikipedia}`}
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
                <InformationDetailsValue>
                  {renderAdress(result)}
                </InformationDetailsValue>
              </InformationDetails>
            </InformationItem>
          ) : null}
          {result.extratags.website ? (
            <InformationItem>
              <InformationIconWrapper>
                <FaHome title="Website Link" />
              </InformationIconWrapper>
              <InformationDetails>
                <InformationDetailsTitle>Website</InformationDetailsTitle>
                <InformationWebsiteLink
                  href={result.extratags.website}
                  title={result.extratags.website}
                  alt={`Link to website of ${result.display_name}`}
                >
                  {result.extratags.website}
                </InformationWebsiteLink>
              </InformationDetails>
            </InformationItem>
          ) : null}
          {result.extratags.phone ? (
            <InformationItem>
              <InformationIconWrapper>
                <FaPhone title="Phone number" />
              </InformationIconWrapper>
              <InformationDetails>
                <InformationDetailsTitle>Phone</InformationDetailsTitle>
                <InformationWebsiteLink
                  title={result.extratags.phone}
                  alt={`Phone number of ${result.name}`}
                >
                  {result.extratags.phone}
                </InformationWebsiteLink>
              </InformationDetails>
            </InformationItem>
          ) : null}
          {result.extratags.email ? (
            <InformationItem>
              <InformationIconWrapper>
                <FaEnvelope />
              </InformationIconWrapper>
              <InformationDetails>
                <InformationDetailsTitle>E-Mail</InformationDetailsTitle>
                <InformationWebsiteLink
                  title={result.extratags.email}
                  alt={`Email address of ${result.name}`}
                  href={`mailto:${result.extratags.email}`}
                >
                  {result.extratags.email}
                </InformationWebsiteLink>
              </InformationDetails>
            </InformationItem>
          ) : null}
        </InformationContainer>
      </DetailsWrapper>
    )
  }
}

export default Details
