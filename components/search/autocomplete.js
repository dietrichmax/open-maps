import React, { useCallback, useEffect, useState, useContext } from "react"
import styled from "styled-components"
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

const AutoCompleteContainer = styled.div`
  width: 100%;
  font-size: 15px;
  margin-top: auto;
  margin-bottom: auto;
`

const AutoCompleteInput = styled(Input)`
  max-width: 250px;
`

const SuggestionsContainer = styled.div`
  position: absolute;
  min-width: 250px;
`

const ListContainer = styled.ol`
  list-style: none;
  padding-inline-start: 0;
  background-color: var(--body-bg);
`

const ListItem = styled.li`
  display: flex;
  align-items: baseline;
  border-bottom: 1px solid var(--border-color);
  padding: 3px 5px;
  cursor: pointer;
  :hover {
    background-color: var(--border-color);
  }
`

const Place = styled.p``

const Country = styled.span`
  font-size: 0.9rem;
  margin-left: 4px;
`

function AutoComplete() {
  const [zoom, setZoom] = useState(8)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [extent, setExtent] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [geocodingResult, setGeocodingResult] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [input, setInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [markerLayer, setMarkerLayer] = useState()
  const [userLang, setUserLang] = useState("de")

  const { map } = useContext(MapContext)

  /*useEffect(() => {
    setUserLang(navigator.language || navigator.userLanguage)
  }, [userLang])*/

  useEffect(() => {
    getOptions()
  }, [input])

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
      setLon(center[0])
      setLat(center[1])
      setZoom(map.getView().getZoom() + 2)
    }
  }

  useEffect(() => {
    getGeocodingResultsDelayed(extent, input, 1)
    setShowSuggestions(true)
  }, [extent])

  const filterData = (data) => {
    const set = new Set()
    //console.log(data)
    if (data.features) {
      return data.features
        .filter((hit) => {
          //console.log(hit)
          if (
            hit.properties.osm_value === "country" ||
            hit.properties.osm_value === "continent" ||
            hit.properties.osm_value === "state" ||
            hit.properties.osm_value === "municipality"
          ) {
            return false
          } else if (hit.properties.type === "county") {
            return false
          }
          return true
        })
        .slice(0, 5)
    }
  }

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  useEffect(() => {
    setShowSuggestions(false)
    if (geocodingResult.bbox) {
      const transformedBbox = transformExtent(
        geocodingResult.bbox,
        "EPSG:4326",
        "EPSG:3857"
      )
      //console.log(transformedBbox)
      map.getView().fit(transformedBbox)
      addMarker(geocodingResult.geometry.coordinates)
    }
  }, [geocodingResult])

  const handleClick = (searchTerm) => {
    removeMarker()
    setInput(searchTerm)
    getGeocodingResults(searchTerm)
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const addMarker = (coordinates) => {
    const iconFeature = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    })

    const vectorSource = new VectorSource({
      features: [iconFeature],
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 2,
    })
    map.addLayer(vectorLayer)
  }

  const removeMarker = () => {
    //markerLayer.clear()
    map.removeLayer(markerLayer)
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
              const secondPart = suggestion.properties.name.replace(
                capitalizeFirstLetter(input),
                ""
              )
              const firstPart = input
              return (
                <ListItem key={index} onClick={() => handleClick(searchTerm)}>
                  <Place>
                    <b>{capitalizeFirstLetter(firstPart)}</b>
                    {secondPart}
                  </Place>
                  <Country>{suggestion.properties.city}</Country>
                </ListItem>
              )
            })}
          </ListContainer>
        </SuggestionsContainer>
      ) : null
    }
  }

  // Geocoding  &lat=${lat}&lon=${lon}

  async function getSuggestionResults(extent, input, limit) {
    if (!input || input.length < 1) return

    const response = await fetch(
      `https://photon.komoot.io/api/?q=${input}&limit=${limit}&lang=${userLang}${
        extent ? "&bbox=" + extent : ""
      }&osm_tag=place`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    const data = await response.json()
    const filteredData = filterData(data)
    setSuggestions(filteredData)
  }
  /*/ if no results `https://photon.komoot.io/api/?q=${input}&limit=${limit}&lang=${userLang}&bbox=${transformExtent(
        map.getView().calculateExtent(map.getSize()),
        "EPSG:3857",
        "EPSG:4326"
      )}&osm_tag=place`,*/

  //https://photon.komoot.io/api/?q=${input}&limit=${limit}&lang=${userLang}&lon=${lon}&lat=${lat}&zoom=${zoom}&location_bias_scale=0.8&osm_tag=place

  const getGeocodingResultsDelayed = useCallback(
    debounce((input, limit, callback) => {
      getSuggestionResults(input, limit).then(callback)
    }, 200),
    []
  )

  async function getGeocodingResults(searchTerm) {
    const encode = encodeURI(searchTerm)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encode}&format=geojson&limit=1`,
      {
        method: "GET",
      }
    )
    const data = await response.json()
    setGeocodingResult(data.features[0])
  }

  return (
    <>
      <AutoCompleteContainer>
        <AutoCompleteInput type="text" onChange={handleChange} value={input} />
        {showSuggestions ? <SuggestionsListComponent /> : null}
      </AutoCompleteContainer>
    </>
  )
}

export default AutoComplete
