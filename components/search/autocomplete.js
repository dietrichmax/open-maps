import React, { useCallback, useEffect, useState, useContext } from "react"
import styled from "styled-components"
import BurgerIcon from "@/components/sidebar/burgerIcon"
import { DrawShapes } from "@/components/draw"
import media from "styled-media-query"
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style"
import { Input } from "@/styles/templates/input"
import { transform } from "ol/proj"
import debounce from "lodash/debounce"
import { transformExtent } from "ol/proj"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { FaMapMarkerAlt, FaTrain } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import Details from "@components/details/details"
import { Sidebar } from "@/components/sidebar"
import MapContext from "@/components/map/mapContext"
import { fetchPOST } from "@/components/utils/fetcher"
import maplibregl from "maplibre-gl"

const Container = styled.div`
  position: relative;
  top: var(--space-sm);
  left: var(--space-sm);
  z-index: 3;
  border-radius: var(--border-radius);
  border-bottom-left-radius: ${(props) => (props.showSuggestions ? 0 : "var(--border-radius)")};
  border-bottom-right-radius: ${(props) => (props.showSuggestions ? 0 : "var(--border-radius)")};
  background-color: var(--body-bg);
  display: flex;
  align-items: center;
  width: 400px;
  height: 65px;
  box-shadow: var(--box-shadow);
  ${media.lessThan("432px")`
    top: 0px;
    left: 0px;
    margin: 0;
    width: 100%;
    border-radius: 0;
  `}
`

// autocomplete

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
`

const SearchAction = styled.div`
  display: flex;
  font-size: 18px;
  padding: 1rem;
  padding-right: 1.25rem;
`

const AutoCompleteContainer = styled.div`
  width: 100%;
  font-size: 15px;
  margin-top: auto;
  margin-bottom: auto;
`

const AutoCompleteInputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--border-color);
  margin-right: 7.5px;
  border-radius: var(--border-radius);
  :focus {
    background-color: #fff;
  }
`

const AutoCompleteInput = styled(Input)`
  width: 100%;
  max-width: 350px;
  height: 50px;
  background-color: var(--border-color);
`

const SuggestionsContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 55px;
  ${media.lessThan("432px")`
  top: 55px;
  height: 100vh;
  background-color: var(--body-bg);
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  `}
`

const ListContainer = styled.ol`
  list-style: none;
  padding-inline-start: 0;
  background-color: var(--body-bg);
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  border-radius: var(--border-radius);
  border-top-left-radius: ${(props) => (props.showSuggestions ? 0 : "var(--border-radius)")};
  border-top-right-radius: ${(props) => (props.showSuggestions ? 0 : "var(--border-radius)")};
  overflow: hidden;
  ${media.lessThan("400px")`
  border-radius: 0;
  `}
`

const ListItem = styled.li`
  display: flex;
  align-items: center;
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
  font-weight: bold;
`

const Adress = styled.div``

const AdressDetails = styled.div``

const AdressDetail = styled.p`
  display: inline-block;
  font-size: 0.7rem;
  margin-right: 4px;
`

const SearchButtonWrapper = styled.div`
  display: flex;
  cursor: pointer;
  font-size: 22px;
  align-items: center;
  padding: 0;
  border: none;
  background: var(--body-bg);
  padding: 1rem;
  border-bottom-left-radius: var(--border-radius);
  border-top-left-radius: var(--border-radius);
`

const ButtonWrapper = styled.div`
  display: inline-block;
  width: 68px;
  text-align: center;
`

const DeleteSearchButtonWrapper = styled.div`
  display: flex;
`

const CloseButton = styled(ImCross)`
  cursor: pointer;
`

function Autocomplete() {
  const [visible, setVisible] = useState(false)
  const [zoom, setZoom] = useState(8)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [extent, setExtent] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [name, setName] = useState()
  const [geocodingResult, setGeocodingResult] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [input, setInput] = useState("")
  const [markerLayer, setMarkerLayer] = useState()
  const [osm_id, setOsm_id] = useState()
  const [osm_type, setOsm_type] = useState()
  const [placeName, setPlaceName] = useState()
  const [gotFirstData, setGotFirstData] = useState(false)
  const [searchQuery, setSearchQuery] = useState(false)

  const { map } = useContext(MapContext)

  useEffect(() => {
    if (osm_id && osm_type) {
      setInput(placeName)
      setName(placeName)
      getGeocodingResults(osm_id, osm_type)
      setShowSuggestions(false)
      setShowResult(true)
    }
  }, [osm_id, osm_type, placeName])

  const updateHash = () => {
    const zoom = map.getZoom().toFixed(2)
    const center = map.getCenter()
    const lonLat = [center.lng, center.lat]
    //const layer = map.getLayers().getArray()[0].getProperties().name

    const urlTemp = window.location.hash
    const urlParams = urlTemp.replace("#", "").split(",")
    if (!geocodingResult || (geocodingResult.length === 0 && urlParams.length < 4)) {
      window.location.hash = lonLat[1].toFixed(4) + "," + lonLat[0].toFixed(4) + "," + zoom
    } else if ((geocodingResult && geocodingResult.osm_id) || urlParams.length > 3) {
      const osmId = geocodingResult.osm_id ? geocodingResult.osm_id : urlParams[3]
      const osmType = geocodingResult.osm_type ? geocodingResult.osm_type[0].toUpperCase() : urlParams[4]
      const placeName = name ? name.replaceAll(" ", "+") : urlParams[5]
      window.location.hash = `${lonLat[1].toFixed(4)},${lonLat[0].toFixed(4)},${zoom},${osmId},${osmType},${placeName}`
    }
  }

  const getHash = () => {
    const urlTemp = window.location.hash
    const urlParams = urlTemp.replace("#", "").split(",")
    const osmId = geocodingResult.osm_id ? geocodingResult.osm_id : urlParams[3]
    const osmType = geocodingResult.osm_type ? geocodingResult.osm_type[0].toUpperCase() : urlParams[4]
    const placeName = name ? name.replaceAll(" ", "+") : urlParams[5]
    if (urlParams.length > 3) {
      setOsm_id(osmId)
      setOsm_type(osmType)
      setPlaceName(placeName.replaceAll("+", " "))
    }
  }

  if (map) {
    map.on("load", getHash)
    map.on("moveend", updateHash)
  }

  const suggestionLimit = 30

  useEffect(() => {
    getOptions()
  }, [searchQuery])

  const getOptions = () => {
    if (map) {
      const center = map.getCenter()
      setExtent(map.getBounds())
      setLon(center.lng)
      setLat(center.lat)
      setZoom(map.getZoom())
    }
  }

  const handleVisability = () => {
    visible ? setVisible(false) : setVisible(true)
  }

  const handleChange = (e) => {
    setGotFirstData(false)
    setInput(e.target.value)
    setSearchQuery(e.target.value.replaceAll(",", "+").replaceAll(" ", "+").replaceAll("++", "+"))
    if (e.target.value.length === 0) {
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    !gotFirstData ? getFirstSuggestionResultsDelayed(lat, lon, searchQuery, suggestionLimit) : null
  }, [extent])

  const filterData = (data) => {
    let set = []
    if (data.features) {
      set = data.features.filter((hit) => {
        if (hit.properties.osm_value === "continent" || hit.properties.osm_value === "state" || hit.properties.osm_value === "municipality") {
          return false
        } else if (hit.properties.type === "county" || hit.properties.type === "country") {
          return false
        }
        return true
      })
      return set.slice(0, 7)
    }
  }

  const selectResult = (searchTerm, osmId, osmType, name) => {
    setInput(searchTerm)
    setName(name)
    getGeocodingResults(osmId, osmType)
    setShowSuggestions(false)
    setShowResult(true)
  }

  const selectInput = () => {
    setName(name)
    getGeocodingResults(osmId, osmType)
    setShowSuggestions(false)
    setShowResult(true)
  }

  const deleteSearch = () => {
    setInput("")
    setGeocodingResult()
    setShowResult(false)
    removeGeojson()
  }

  const HandleSearch = () => {
    if (!showResult)
      return (
        /*<DeleteSearchButtonWrapper>
      <FaSearch 
          style={{ color: "var(--gray)", fontSize: "11px" }}
          title="Search"
          onClick={selectInput}/>
    </DeleteSearchButtonWrapper>*/
        null
      )
    return (
      <DeleteSearchButtonWrapper>
        <CloseButton style={{ color: "var(--gray)", fontSize: "11px" }} title="Delete search" onClick={deleteSearch} />
      </DeleteSearchButtonWrapper>
    )
  }

  useEffect(() => {
    removeGeojson()
    setShowSuggestions(false)
    if (geocodingResult && geocodingResult.boundingbox) {
      const bbox = [geocodingResult.boundingbox[2], geocodingResult.boundingbox[0], geocodingResult.boundingbox[3], geocodingResult.boundingbox[1]]
      map.fitBounds(bbox, {
        linear: true,
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
      })
    }
    setShowSuggestions(false)
    if (map) {
      addGeojson(geocodingResult)
    }
  }, [geocodingResult])

  const addGeojson = (geocodingResult) => {
    if (geocodingResult === undefined || null) return
    if (!map.getSource("geojson_source")) {
      map.addSource("geojson_source", {
        type: "geojson",
        data: geocodingResult.geojson,
      })
    }
    if (!map.getLayer("geojson_layer")) {
      map.addLayer({
        id: "geojson_layer",
        type: "fill",
        source: "geojson_source",
        layout: {},
        paint: {
          "line-color": "#3f72af",
          "line-width": 3,
        },
      })
    }
    if (!map.getLayer("geojson_outline")) {
      map.addLayer({
        id: "geojson_outline",
        type: "line",
        source: "geojson_source",
        layout: {},
        paint: {
          "line-color": "#3f72af",
          "line-width": 3,
        },
      })
    }
  }

  const removeGeojson = () => {
    // remove source
    if (map && map.getLayer("geojson_layer")) {
      map.removeLayer("geojson_layer")
      console.log("layer")
    }
    if (map && map.getLayer("geojson_outline")) {
      map.removeLayer("geojson_outline")
    }
    if (map && map.getSource("geojson_source")) {
      map.removeSource("geojson_source")
    }
  }

  const getFirstSuggestionResultsDelayed = useCallback(
    debounce((lat, lon, input, limit, callback) => {
      getFirstSuggestionResults(lat, lon, input, limit).then(callback)
    }, 200),
    []
  )

  async function getFirstSuggestionResults(lat, lon, input, limit) {
    if (!input || input.length < 1) return
    const data = await fetchPOST("/api/autocomplete", { lat, lon, input, limit, zoom })
    if (!data) {
      console.log("error")
    } else {
      setGotFirstData(true)
      const filteredData = filterData(data)
      setSuggestions(filteredData)
      setShowSuggestions(true)
    }
  }

  async function getGeocodingResults(osmId, osmType) {
    //push(["trackEvent", "search", true])
    const data = await fetchPOST(`/api/details`, { osmId, osmType })
    if (!data) {
      console.log("error")
    } else {
      setGeocodingResult(data)
      setShowSuggestions(false)
    }
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
          <ListContainer showSuggestions={showSuggestions} name="suggestions">
            {suggestions.map((suggestion, index) => {
              const searchTerm = `${
                suggestion.properties.name
                  ? suggestion.properties.name
                  : suggestion.properties.street
                  ? suggestion.properties.street
                  : suggestion.properties.housenumber
                  ? suggestion.properties.housenumber
                  : null
              }${suggestion.properties.city ? ", " + suggestion.properties.city : ""}`
              const name = suggestion.properties.name
              const osmId = suggestion.properties.osm_id
              const osmType = suggestion.properties.osm_type
              /*const secondPart = suggestion.properties.name.replace(
                capitalizeFirstLetter(input),
                ""
              )
              const firstPart = input*/
              return (
                <ListItem key={index} onClick={() => selectResult(searchTerm, osmId, osmType, name)}>
                  <ButtonWrapper>{getSymbol(suggestion.properties.osm_value)}</ButtonWrapper>
                  <Adress>
                    {suggestion.properties.name ? <Place>{`${suggestion.properties.name}`}</Place> : null}
                    <AdressDetails>
                      {suggestion.properties.street ? <AdressDetail>{`${suggestion.properties.street} `}</AdressDetail> : null}
                      {suggestion.properties.housenumber ? <AdressDetail>{`${suggestion.properties.housenumber}`}</AdressDetail> : null}
                      {suggestion.properties.city ? <AdressDetail>{`${suggestion.properties.city}`}</AdressDetail> : null}
                      {suggestion.properties.county ? <AdressDetail>{`${suggestion.properties.county}`}</AdressDetail> : null}
                      {suggestion.properties.country ? <AdressDetail>{`${suggestion.properties.country}`}</AdressDetail> : null}
                      {suggestion.properties.AdressDetail ? <AdressDetail>{suggestion.properties.AdressDetail}</AdressDetail> : null}
                    </AdressDetails>
                  </Adress>
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
      {visible ? <Sidebar visible={visible} /> : null}
      <>
        <Container showSuggestions={showSuggestions}>
          <SearchButtonWrapper onClick={() => handleVisability()}>
            <BurgerIcon />
          </SearchButtonWrapper>
          <SearchContainer>
            <AutoCompleteContainer>
              <AutoCompleteInputContainer>
                <AutoCompleteInput type="text" onChange={handleChange} value={input} placeholder="Search in mxd.codes Maps" />
                <SearchAction>
                  <HandleSearch />
                </SearchAction>
              </AutoCompleteInputContainer>
              {showSuggestions ? <SuggestionsListComponent /> : null}
            </AutoCompleteContainer>
          </SearchContainer>
        </Container>
        {geocodingResult ? <Details result={geocodingResult} name={name} /> : null}
        {/*<LayerSwitcher sidebarVisible={showResult} />*/}
      </>
    </>
  )
}

export default Autocomplete
