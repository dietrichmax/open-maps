import styled from "styled-components"
import { useState, useEffect } from "react"
import { config } from "config"
import {
  FaRoute,
  FaDirections,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaShare,
  FaBookmark,
} from "react-icons/fa"
import { ImCross } from "react-icons/im"
const md5 = require("md5")
import Image from "next/image"
import media from "styled-media-query"

const DetailsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100%;
  background-color: #fff;
  width: var(--sidebar-width);
  border: 0;
  box-shadow: var(--box-shadow);
  ${media.lessThan("416px")`
    margin: 0;
    width: 100%;
    height: auto;
    padding-bottom: 2.5rem;
  `}
`

const ImageWrapper = styled.div`
  display: block;
  width: 100%;
  height: 300px;
  margin-bottom: 1rem;
  ${media.lessThan("416px")`
  margin: 0;
  height: 230px;
`}
`

const Header = styled.div`
  padding: 1rem 2rem 2rem 2rem;
  display: block;
  border-bottom: 1px solid var(--border-color);
  ${media.lessThan("416px")`
  padding: 1rem 2rem 1rem 2rem;
  `}
`

const Title = styled.h1`
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.75rem;
`

const Address = styled.h2`
  margin-top: 1rem;
  font-weight: 400;
`

const Actions = styled.div`
  display: flex;
  padding: 0 2rem 0 2rem;
  justify-content: space-between;
`

const ActionWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
  margin-right: 1rem;
  margin-bottom: 2rem;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 40px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  width: 50px;
  height: 50px;
  :hover {
    border: 1px solid var(--secondary-color);
  }

  ${media.lessThan("416px")`
  margin-top: 1rem;
  margin-bottom: 1rem;
  `}
`

const WikipediaData = styled.div`
  padding: 0 2rem 0 2rem;
`

const WikipediaDataContainer = styled.div``
const WikipediaTitle = styled.h3`
  margin-bottom: 1rem;
`

const WikipediaCredit = styled.div`
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

function Details({ result, lang }) {
  const [visible, setVisible] = useState(false)
  const [wikimediaImageUrl, setwikimediaImageUrl] = useState()
  const [wikipediaData, setWikipediaData] = useState(false)

  //console.log(result)

  const renderImage = () => {
    if (!wikimediaImageUrl) {
      return null
    }
    return (
      <>
        <Image
          src={
            wikimediaImageUrl
              ? wikimediaImageUrl
              : `https://source.unsplash.com/random/300×450/?${result.display_name}`
          }
          height="300"
          width="450"
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
      </>
    )
  }

  const renderWikidata = () => {
    if (!wikipediaData) {
      return null
    }
    return (
      <WikipediaData>
        <WikipediaTitle>Short Summary</WikipediaTitle>
        <WikipediaDataContainer>
          {wikipediaData.substr(0, wikipediaData.indexOf(". "))}.
        </WikipediaDataContainer>

        <WikipediaCredit>
          Data from{" "}
          <WikipediaLink
            title={`https://en.wikipedia.org/wiki/${result.extratags.wikipedia}`}
            href={`https://en.wikipedia.org/wiki/${result.extratags.wikipedia}`}
          >
            Wikipedia
          </WikipediaLink>{" "}
          API.
        </WikipediaCredit>
      </WikipediaData>
    )
  }

  useEffect(() => {
    getWikimediaImageUrl(result)
    getWikipediaData(result)
  }, [result])

  //getWikimediaImageUrl(result)
  async function getWikimediaImageUrl(result) {
    if (!result || !result.extratags) {
      setwikimediaImageUrl()
      return null
    }
    const res = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${result.extratags.wikidata}&origin=*&format=json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": config.email,
        },
      }
    )
    const data = await res.json()
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
    let wikipedia
    if (!result || !result.extratags || !result.extratags.wikipedia) {
      setWikipediaData()
      return null
    }

    wikipedia = result.extratags.wikipedia.replace(/^.+:/, "")
    const encode = encodeURI(wikipedia)
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&continue=&format=json&formatversion=2&format=json&titles=${encode}&origin=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": config.email,
        },
      }
    )
    if (!res.ok) {
      throw new Error(res.statusText)
    } else {
      const data = await res.json()
      console.log(data)
      setWikipediaData(data.query.pages[0].extract.toString())
    }
  }

  const deleteSearch = () => {}

  const renderAdress = (address) => {
    if (!address) {
      return null
    } else {
      return (
        <Address>
          {address.county ? `${address.county},` : null}
          {address.street ? ` ${address.street} ` : null}
          {address.housenumber ? ` ${address.housenumber},` : null}
          {address.postcode ? ` ${address.postcode}` : null}
          {address.city ? ` ${address.city},` : null}
          {address.country ? ` ${address.country}` : null}
        </Address>
      )
    }
  }
  if (result.length === 0) {
    return null
  } else {
    return (
      <DetailsWrapper>
        <ImageWrapper>{renderImage()}</ImageWrapper>
        <Header>
          {result.display_name ? <Title>{result.display_name}</Title> : null}
          {/*renderAdress(result.address)*/}
        </Header>
        <Actions>
          <ActionWrapper>
            <FaRoute />
          </ActionWrapper>

          {result.extratags.website ? (
            <a
              href={result.extratags.website}
              title={result.extratags.website}
              alt={`Link to website  of ${result.display_name}`}
            >
              <ActionWrapper>
                <FaHome />
              </ActionWrapper>
            </a>
          ) : null}
          {result.extratags.phone ? (
            <ActionWrapper
              title={result.extratags.phone}
              alt={`Phone number of ${result.display_name}`}
            >
              <FaPhone />
            </ActionWrapper>
          ) : null}
          {result.extratags.email ? (
            <a
              href={`mailto:${result.extratags.email}`}
              title={result.extratags.email}
              alt={`Email of ${result.display_name}`}
            >
              <ActionWrapper>
                <FaEnvelope />
              </ActionWrapper>
            </a>
          ) : null}
          <ActionWrapper title="Save this place">
            <FaBookmark />
          </ActionWrapper>
          <ActionWrapper title="Share this place">
            <FaShare />
          </ActionWrapper>
        </Actions>
        {renderWikidata()}
        <CloseDetailsContainer onClick={deleteSearch}>
          <ImCross />
        </CloseDetailsContainer>
      </DetailsWrapper>
    )
  }
}

export default Details
