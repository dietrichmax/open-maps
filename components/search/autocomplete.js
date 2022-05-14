import React, { useCallback, useEffect, useState, useContext } from "react"
import styled from "styled-components"
import Logo from "@/components/logo/logo"
import BurgerIcon from "@/components/sidebar/burgerIcon"
import { DrawShapes } from "@/components/draw"
import media from "styled-media-query"
import { Input } from "@/styles/templates/input"
import { Button } from "@/styles/templates/button"
import MapContext from "../map/mapContext"
import { fromLonLat } from "ol/proj"
import { transform } from "ol/proj"
import { Point } from "ol/geom"
import debounce from "lodash/debounce"
import { transformExtent } from "ol/proj"
import { Feature } from "ol"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import { FaSearch } from "react-icons/fa"
import { FaMapMarkerAlt, FaTrain } from "react-icons/fa"
import Details from "@/components/search/details/details"
import { config } from "config"
import {Icon, Style} from 'ol/style';
import { push } from "@socialgouv/matomo-next";


const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  margin: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--border-radius);
  background-color: var(--body-bg);
  display: flex;
  align-items: center;
  width: 400px;
  opacity: 0.9;
  ${media.lessThan("416px")`
    margin: 0;
    width: 100%;
  `}
`

const SidebarContainer = styled.div`
  position: absolute;
  z-index: 3;
  background-color: var(--body-bg);
  width: var(--sidebar-width);
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

// autocomplete

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
`

const SearchButton = styled(Button)`
  display: flex;
  font-size: 100%;
  padding: 0.5rem 0.75rem;
`

const AutoCompleteContainer = styled.div`
  width: 100%;
  font-size: 15px;
  margin-top: auto;
  margin-bottom: auto;
`

const AutoCompleteInput = styled(Input)`
  width: 100%;
  font-size: 15px;
  margin-top: auto;
  margin-bottom: auto;
  max-width: 350px;
  ::placeholder {
    color: var(--gray);
  }
`

const SuggestionsContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 61px;
`

const ListContainer = styled.ol`
  list-style: none;
  padding-inline-start: 0;
  background-color: var(--body-bg);
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
`

const ListItem = styled.li`
  align-items: baseline;
  padding-top: 6px;
  padding-bottom: 7px;
  padding-right: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  :hover {
    background-color: var(--border-color);
  }
`

const Place = styled.p`
  display: inline-block;
  font-size: 0.9rem;
`

const County = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  margin-left: 4px;
`

const Country = styled.p`
  display: inline-block;
  font-size: 0.7rem;
  margin-left: 4px;
`

const ButtonWrapper = styled.div`
  display: inline-block;
  width: 57px;
  text-align: center;
`

function Autocomplete() {
  const [visible, setVisible] = useState(false)
  const [zoom, setZoom] = useState(8)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [extent, setExtent] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [gotSecondSuggestions, setGotSecondSuggestions] = useState(false)
  const [geocodingResult, setGeocodingResult] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [input, setInput] = useState("")
  const [markerLayer, setMarkerLayer] = useState()
  const [userLang, setUserLang] = useState("en")
  const [gotFirstData, setGotFirstData] = useState(false)
  const [gotSecondData, setGotSecondData] = useState(false)
  const [searchQuery, setSearchQuery] = useState(false)

  const { map } = useContext(MapContext)

  const suggestionLimit = 5

  useEffect(() => {
    setUserLang((navigator.language || navigator.userLanguage).slice(0, 2))
  }, [userLang])

  useEffect(() => {
    getOptions()
  }, [searchQuery])

  const getOptions = () => {
    if (map) {
      const center = transform(
        map.getView().getCenter(),
        "EPSG:3857",
        "EPSG:4326"
      )
      setExtent(
        transformExtent(
          map.getView().calculateExtent(map.getSize()),
          "EPSG:3857",
          "EPSG:4326"
        )
      )
      setLon(parseInt(center[0]))
      setLat(parseInt(center[1]))
      setZoom(parseInt(map.getView().getZoom() + 2))
    }
  }

  const handleVisability = () => {
    visible ? setVisible(false) : setVisible(true)
  }

  const handleChange = (e) => {
    setGotFirstData(false)
    setGotSecondData(false)
    setInput(e.target.value)
    setSearchQuery(e.target.value.replaceAll(",","+").replaceAll(" ","+").replaceAll("++","+"))
  }

  useEffect(() => {
    !gotFirstData
      ? getFirstSuggestionResultsDelayed(extent, searchQuery, suggestionLimit)
      : null
  }, [extent])

  useEffect(() => {
    const difference = suggestionLimit - suggestions.length
    if (difference != 0) {
      gotFirstData && !gotSecondData
        ? getSecondSuggestionResults(lat, lon, zoom, input, difference)
        : null
    }
  }, [suggestions])

  const filterData = (data) => {
    let set = []
    if (data.features) {
      set = data.features.filter((hit) => {
        if (
          hit.properties.osm_value === "country" ||
          hit.properties.osm_value === "continent" ||
          hit.properties.osm_value === "state" ||
          hit.properties.osm_value === "municipality"
        ) {
          return false
        } else if (hit.properties.type === "county") {
          return false
        } else if (hit.properties.osm_key === "boundary") {
          return false
        }
        return true
      })
      return set.slice(0, 5)
    }
  }

  const selectResult = (searchTerm, osmId, osmType) => {
    //console.log("test")
    removeMarker()
    setInput(searchTerm)
    getGeocodingResults(osmId, osmType)
    setShowSuggestions(false)
    push(["trackEvent", "search", searchTerm]);
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Marker
  useEffect(() => {
    setShowSuggestions(false)
    if (geocodingResult.boundingbox) {
      const transformedBbox = transformExtent(
        [
          geocodingResult.boundingbox[2],
          geocodingResult.boundingbox[0],
          geocodingResult.boundingbox[3],
          geocodingResult.boundingbox[1],
        ],
        "EPSG:4326",
        "EPSG:3857"
      )
      map.getView().fit(transformedBbox, {
        duration: 1000,
      })
      addMarker(geocodingResult)
    }
    setShowSuggestions(false)
  }, [geocodingResult])

  const addMarker = (geocodingResult) => {
    const marker = new Feature({
      geometry: new Point(
        fromLonLat([geocodingResult.lon, geocodingResult.lat])
      ),
      name: "Marker",
    })
    const vectorSource = new VectorSource({
      features: [marker],
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 2,
      /*style: new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          // src: "marker.png",
          src: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/24/map-marker-icon.png'
        })
      })*/
    })
    map.addLayer(vectorLayer)
  }

  const removeMarker = () => {
    //markerLayer.clear()
    map.removeLayer(markerLayer)
  }

  async function getFirstSuggestionResults(extent, input, limit) {
    if (!input || input.length < 1) return
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${input}&limit=${limit}&lang=${userLang}${
        extent ? "&bbox=" + extent : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": config.email,
        },
      }
    )
    const data = await response.json()
    setGotFirstData(true)
    const filteredData = filterData(data)
    setSuggestions(filteredData)
    setShowSuggestions(true)
  }

  async function getSecondSuggestionResults(lat, lon, zoom, input, limit) {
    const encodedInput = encodeURI(input)
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodedInput}&limit=${limit}&lang=${userLang}&lon=${lon}&lat=${lat}&zoom=0&location_bias_scale=0.1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": config.email,
        },
      }
    )
    const data = await response.json()
    setGotSecondData(true)
    const filteredData = filterData(data)
    setSuggestions((suggestions) =>
      [...filteredData, ...suggestions].slice(0, 5)
    )
  
    setShowSuggestions(true)
  }

  const getFirstSuggestionResultsDelayed = useCallback(
    debounce((extent, input, limit, callback) => {
      getFirstSuggestionResults(extent, input, limit).then(callback)
    }, 200),
    []
  )

  async function getGeocodingResults(osmId, osmType) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmType}${osmId}&format=json&extratags=1&addressdetails=1&accept-language=${userLang}&polygon_geojson=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": config.email,
        },
      }
    )
    const data = await response.json()
    setGeocodingResult(data[0])
    setShowSuggestions(false)
  }

  const getSymbol = (value) => {
    if (value === "train_station") {
      return <FaTrain />
    } else {
      return <FaMapMarkerAlt />
    }
  }

  const SuggestionsListComponent = () => {
    if (!suggestions || input.length === 0) {
      return
    } else {
      return suggestions.length ? (
        <SuggestionsContainer>
          <ListContainer Name="suggestions">
            {suggestions.map((suggestion, index) => {
              const searchTerm = `${suggestion.properties.name}${
                suggestion.properties.city
                  ? ", " + suggestion.properties.city
                  : ""
              }`
              const osmId = suggestion.properties.osm_id
              const osmType = suggestion.properties.osm_type
              /*onst secondPart = suggestion.properties.name.replace(
                capitalizeFirstLetter(input),
                ""
              )
              const firstPart = input*/
              return (
                <ListItem
                  key={index}
                  onClick={() => selectResult(searchTerm, osmId, osmType)}
                >
                  <ButtonWrapper>
                    {getSymbol(suggestion.properties.osm_value)}
                  </ButtonWrapper>
                  <Place>{suggestion.properties.name}</Place>
                  {suggestion.properties.city ? (
                    <Country>{suggestion.properties.city}</Country>
                  ) : null}
                  {suggestion.properties.street ? (
                    <County>{suggestion.properties.street}</County>
                  ) : null}
                  {suggestion.properties.country ? (
                    <Country>{suggestion.properties.country}</Country>
                  ) : null}
                </ListItem>
              )
            })}
          </ListContainer>
        </SuggestionsContainer>
      ) : null
    }
  }

  return (
    <>
      {visible ? (
        <>
          <SidebarContainer>
            <Header>
              <Logo />
              <CloseButton onClick={handleVisability}>Close</CloseButton>
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
      <>
        <Container>
          <ButtonWrapper onClick={handleVisability}>
            <BurgerIcon />
          </ButtonWrapper>
          <SearchContainer>
            <AutoCompleteContainer>
              <AutoCompleteInput
                type="text"
                onChange={handleChange}
                value={input}
                placeholder="Search in mxd.codes Maps"
              />
              {showSuggestions ? <SuggestionsListComponent /> : null}
            </AutoCompleteContainer>
            <SearchButton>
              <FaSearch />
            </SearchButton>
          </SearchContainer>
        </Container>
        {geocodingResult ? <Details result={geocodingResult} /> : null }
      </>
    </>
  )
}

export default Autocomplete
