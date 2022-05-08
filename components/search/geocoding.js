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

const AutoCompleteContainer = styled.div`
  width: 100%;
`

function AutoComplete() {
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [searchString, setSearchString] = useState("")
  const [geocodingResults, setGeocodingResults] = useState([])
  const [userLang, setUserLang] = useState("en")
  //const [userIp, setUserIp] = useState();http://www.geoplugin.net/json.gp?ip=93.227.112.181
  //const [userLonLat, setserLonLat] = useState([0,0]);
  const [searchTimer, setSearchTimer] = useState(0)

  const { map } = useContext(MapContext)

  function clearGeocodingResults() {
    setGeocodingResults()
  }
  function handleClick() {
    setIsMenuOpened({ isMenuOpened: !isMenuOpened })
  }

  function handleChange(event) {
    setSearchString(event.target.value)
    if (!searchString || searchString.length < 2) return
    getGeocodingResultsDelayed(searchString, 5)
    //console.log(geocodingResults)
  }

  function handleSelect(value) {
    setSearchString(value)
    getFinalResults(searchString)
    /*map.getView().fit(point, { 
      padding: [100, 100, 100, 100], 
  });*/
  }

  useEffect(() => {
    //console.log(geocodingResults.length)
    //console.log(searchString)
  }, [])

  async function getGeocodingResults(searchString, limit) {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${searchString}&limit=${limit}&lang=${userLang}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    const data = await response.json()
    setGeocodingResults(data.features)
    //console.log(geocodingResults.length)
  }

  const getGeocodingResultsDelayed = useCallback(
    debounce((searchString, limit, callback) => {
      getGeocodingResults(searchString, limit).then(callback)
    }, 2000),
    []
  )

  useEffect(() => {
    setUserLang(navigator.language || navigator.userLanguage)
  }, [userLang])

  /*useEffect(() => {
    //console.log(previewResults.length)
  }, [previewResults])*/

  function renderItem(item, isHighlighted) {
    return (
      <li
        key={`${item.properties.name}-${item.properties.country}`}
        style={{
          background: isHighlighted ? "lightgray" : "white",
          listStyle: "none",
        }}
      >
        <b>{item.properties.name}</b>
        <p>{item.properties.country}</p>
      </li>
    )
  }

  function getItemValue(item) {
    return `${item.properties.name}`
  }

  function renderInput(props) {
    return <Input {...props} />
  }

  function renderMenu(items, value, style) {
    console.log(items)
    return <div children={items} />
  }

  return (
    <>
      <AutoCompleteContainer>
        <input type="text" />
      </AutoCompleteContainer>
    </>
  )
}

export default AutoComplete
