import React, { useCallback, useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { Input } from "@/styles/templates/input"
import { Button } from "@/styles/templates/button"
import { FaSearch } from "react-icons/fa"
import { FiMenu } from "react-icons/fi"
import Autocomplete from "react-autocomplete"
import MapContext from "../map/mapContext"
import { fromLonLat } from "ol/proj"
import { transform } from "ol/proj"
import { Point } from "ol/geom"
import debounce from "lodash/debounce"
import { filter } from "lodash"
import { transformExtent } from "ol/proj"

const AutoCompleteContainer = styled.div`
  width: 100%;
`

const AutoCompleteInput = styled.input`
  min-width: 250px;
  border: 0 !important;
  outline: none !important;
  padding: 3px 5px;
  font-size: 100%;
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
  const [suggestions, setSuggestions] = useState([])
  const [result, setResult] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [input, setInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [osm_id, setOsm_id] = useState()
  const [userLang, setUserLang] = useState("en")

  const { map } = useContext(MapContext)

  /*let mapViewCenter
  let lon
  let lat
  if (map) {
    mapViewCenter = map ? map.getView().getCenter() : null
    console.log(mapViewCenter[0])
  }*/

  const handleChange = (e) => {
    setInput(e.target.value)
    getGeocodingResultsDelayed(input, 5)
    setActiveSuggestionIndex(0)
    setShowSuggestions(true)
  }

  const handleClick = (e) => {
    setInput(searchTerm.toString())
    setActiveSuggestionIndex(0)
    setShowSuggestions(false)
    //getGeocodingResultsDelayed(input, 1)
    getNominatimInfo()
    //map.getView().setCenter(transform(suggestions[0].geometry.coordinates, 'EPSG:4326', 'EPSG:3857'));
    console.log(result)
    if (result.bbox) {
      //console.log(result.bbox)
      const transformedBbox = transformExtent(
        result.bbox,
        "EPSG:4326",
        "EPSG:3857"
      )
      //console.log(transformedBbox)
      map.getView().fit(transformedBbox)
    }
  }

  const SuggestionsListComponent = () => {
    if (!suggestions) {
      return
    } else {
      return suggestions.length ? (
        <SuggestionsContainer>
          <ListContainer class="suggestions">
            {suggestions.map((suggestion, index, i) => {
              setSearchTerm(
                `${suggestion.properties.name}, ${suggestion.properties.country}`
              )
              let className
              // Flag the active suggestion with a class
              if (index === activeSuggestionIndex) {
                className = "suggestion-active"
              }
              return (
                <ListItem key={i} className={className} onClick={handleClick}>
                  <Place>{suggestion.properties.name}</Place>
                  <Country>{suggestion.properties.country}</Country>
                </ListItem>
              )
            })}
          </ListContainer>
        </SuggestionsContainer>
      ) : null
    }
  }

  // Geocoding  &lat=${lat}&lon=${lon}

  async function getGeocodingResults(searchString, limit) {
    if (!searchString || searchString.length < 1) return
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${searchString}&limit=${limit}&lang=${userLang}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    const data = await response.json()
    //console.log(data.features)
    setSuggestions(data.features)
    setOsm_id(data.features[0].properties.osm_id)
  }

  const getGeocodingResultsDelayed = useCallback(
    debounce((searchString, limit, callback) => {
      getGeocodingResults(searchString, limit).then(callback)
    }, 200),
    []
  )

  async function getNominatimInfo() {
    const encode = encodeURI(input)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encode}&format=geojson&limit=1`,
      {
        method: "GET",
      }
    )
    const data = await response.json()
    //console.log(data)
    setResult(data.features[0])
  }

  useEffect(() => {
    setUserLang(navigator.language || navigator.userLanguage)
  }, [userLang])

  return (
    <>
      <AutoCompleteContainer>
        <AutoCompleteInput type="text" onChange={handleChange} value={input} />
        {showSuggestions && input && <SuggestionsListComponent />}
      </AutoCompleteContainer>
    </>
  )
}

export default AutoComplete
