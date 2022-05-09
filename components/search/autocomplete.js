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
  font-family: var(--primary-font);
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
  const [result, setResult] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [input, setInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [osm_id, setOsm_id] = useState()
  const [userLang, setUserLang] = useState("de")

  const { map } = useContext(MapContext)

  /*useEffect(() => {
    setUserLang(navigator.language || navigator.userLanguage)
  }, [userLang])*/

  useEffect(() => {
    getOptions()
    getGeocodingResultsDelayed(input, 20)
    setActiveSuggestionIndex(0)
    setShowSuggestions(true)
  }, [input])

  useEffect(() => {
    /*getOptions()
    getGeocodingResultsDelayed(input, 5)
    setActiveSuggestionIndex(0)
    setShowSuggestions(true)*/
  }, [searchTerm])

  const getOptions = () => {
    if (map) {
      const center = transform(map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
      setExtent(transformExtent(map.getView().calculateExtent(map.getSize()),"EPSG:3857","EPSG:4326"))
      setLon(center[0])
      setLat(center[1])
      setZoom(map.getView().getZoom() + 2 )
    }
  }

  const filterData = (data) => {
    const set = new Set()
    //console.log(data)
    if (data.features) {
      return data.features.filter(hit => {           
        console.log(hit)
        if (hit.properties.osm_value === "country" || hit.properties.osm_value === "continent" || hit.properties.osm_value === "state" || hit.properties.osm_value === "municipality") {
          return false
        } else if (hit.properties.type === "county") {
          return false
        }
        return true
      }).slice(0,5)
    } 
  }

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  const showResults = () => {
    getGeocodingResults()
    //console.log(showSuggestions)
    //console.log(searchTerm)

  }
  const handleClick = (searchTerm) => {
    setInput(searchTerm)
    setActiveSuggestionIndex(0)
  
    showResults()

    if (result.bbox) {
      const transformedBbox = transformExtent(
        result.bbox,
        "EPSG:4326",
        "EPSG:3857"
      )
      //console.log(transformedBbox)
      map.getView().fit(transformedBbox)
    }
    setShowSuggestions(false)
  }

  const SuggestionsListComponent = () => {
    if (!suggestions || input.length === 0) {
      return
    } else {
      return suggestions.length ? (
        <SuggestionsContainer>
          <ListContainer Name="suggestions">
            {suggestions.map((suggestion, index, ) => {
              const searchTerm = `${suggestion.properties.name}, ${suggestion.properties.city ?  suggestion.properties.city : ""}`
              //console.log(suggestion)
              let className
              // Flag the active suggestion with a class
              if (index === activeSuggestionIndex) {
                className = "suggestion-active"
              }
              return (
                <ListItem key={suggestion.properties.osm_id} className={className} onClick={() => handleClick(searchTerm)}>
                    <Place>{suggestion.properties.name}</Place>
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

  async function getSuggestionResults(input, limit) {
    if (!input || input.length < 1) return

    const response = await fetch(
      `https://photon.komoot.io/api/?q=${input}&limit=${limit}&lang=${userLang}${extent ? "&bbox=" + extent : null}&osm_tag=place`,
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

  async function getGeocodingResults() {
    const encode = encodeURI(input)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encode}&format=geojson&limit=1`,
      {
        method: "GET",
      }
    )
    const data = await response.json()
    console.log(data)
    setResult(data.features[0])
  }



  return (
    <>
      <AutoCompleteContainer>
        <AutoCompleteInput type="text" onChange={handleChange} value={input} />
         {showSuggestions ? <SuggestionsListComponent /> : null }
      </AutoCompleteContainer>
    </>
  )
}

export default AutoComplete
