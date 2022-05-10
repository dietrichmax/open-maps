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
import { FaSearch } from "react-icons/fa"
import { slice } from "lodash"

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
`

const SearchButton = styled(Button)`
  display: flex;
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
  top: 61px
`

const ListContainer = styled.ol`
  list-style: none;
  padding-inline-start: 0;
  background-color: var(--body-bg);
`

const ListItem = styled.li`
  display: flex;
  align-items: baseline;
  padding-top: 6px;
  padding-bottom: 7px;
  margin-left: 57px;
  cursor: pointer;
  :hover {
    background-color: var(--border-color);
  }
`

const Place = styled.p`
  font-size: .9rem;
`

const Country = styled.span`
  font-size: 0.70rem;
  margin-left: 4px;
`

function AutoComplete() {
  const [zoom, setZoom] = useState(8)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [extent, setExtent] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [gotSecondSuggestions, setGotSecondSuggestions] = useState(false)
  const [geocodingResult, setGeocodingResult] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [input, setInput] = useState("")
  const [resultDifference, setResultDifference] = useState(0)
  const [markerLayer, setMarkerLayer] = useState()
  const [userLang, setUserLang] = useState("en")

  const { map } = useContext(MapContext)

  const suggestionSearchLimit = 5

  useEffect(() => {
    setUserLang((navigator.language || navigator.userLanguage).slice(0,2))
  }, [userLang])


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
      setLon(parseInt(center[0]))
      setLat(parseInt(center[1]))
      setZoom(parseInt(map.getView().getZoom() + 2))
    }
  }

  const handleChange = (e) => {
    setInput(e.target.value)
  }


  useEffect(() => {
    //console.log(resultDifference)
    if (resultDifference > 0) {
      getSecondSuggestionResults(lat, lon, zoom, input, 200)
    } 
  }, [resultDifference])


  useEffect(() => {
    if (suggestions) {
      //filterDuplicates(suggestions)//setSuggestions(filterDuplicates(suggestions))
    }
  }, [suggestions])

  
  useEffect(() => {
    getFirstSuggestionResultsDelayed(extent, input, suggestionSearchLimit)

  }, [extent])

  const filterData = (data) => {
    let set = []
    if (data.features) {
      set = data.features
        .filter((hit) => {
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
        return set.slice(0,5)
    }
  }

  useEffect(() => {
    setShowSuggestions(false)
    if (geocodingResult.bbox) {
      const transformedBbox = transformExtent(
        geocodingResult.bbox,
        "EPSG:4326",
        "EPSG:3857"
      )
      map.getView().fit(transformedBbox,  { duration: 1000 });
      addMarker(geocodingResult.geometry.coordinates)
    }
    setShowSuggestions(false)
  }, [geocodingResult])

  const handleClick = (searchTerm) => {
    removeMarker()
    setInput(searchTerm)
    getGeocodingResults(searchTerm)
    setShowSuggestions(false)
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

  // Geocoding  &lat=${lat}&lon=${lon}



  async function getFirstSuggestionResults(extent, input, limit) {
    if (!input || input.length < 1) return
    setGotSecondSuggestions(false)
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${input}&limit=${limit}&lang=${userLang}${
        extent ? "&bbox=" + extent : ""
      }`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    const data = await response.json()
    const filteredData = filterData(data)
    setResultDifference(suggestionSearchLimit - filteredData.length)
    setSuggestions(filteredData)
    setShowSuggestions(true)
  }

  const getFirstSuggestionResultsDelayed = useCallback(
    debounce((extent, input, limit, callback) => {
      getFirstSuggestionResults(extent, input, limit).then(callback)
    }, 200),
    []
  )

  async function getSecondSuggestionResults(lat, lon, zoom, input, limit) {

    const response = await fetch(
      `https://photon.komoot.io/api/?q=${input}&limit=${limit}&lang=${userLang}&lon=${lon}&lat=${lat}&zoom=${zoom + 10}&location_bias_scale=0.2`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    const data = await response.json()
    const filteredData = filterData(data)
    setSuggestions((suggestions) => [...filteredData, ...suggestions].slice(0,5))
    setShowSuggestions(true)
  }

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
    console.log("test1")
    setShowSuggestions(false)
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
                  <Place>{suggestion.properties.name}</Place>
                  <Country>{suggestion.properties.county}</Country>
                </ListItem>
              )
            })}
          </ListContainer>
        </SuggestionsContainer>
      ) : null
    }
  }

  return (
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
  )
}

export default AutoComplete
