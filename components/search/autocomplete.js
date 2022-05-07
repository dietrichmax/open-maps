import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { Input } from "@/styles/templates/input"
import { Button } from "@/styles/templates/button"
import { FaSearch } from "react-icons/fa"
import { FiMenu } from "react-icons/fi"
import Autocomplete from "react-autocomplete"
import MapContext from "../map/mapContext"
import {fromLonLat} from 'ol/proj';
import { transform } from "ol/proj"
import { Point } from "ol/geom"

const AutoCompleteContainer = styled.div`
  width: 100%;
`

function AutoComplete() {
  const [isMenuOpened, setIsMenuOpened] = useState(false)
  const [searchString, setSearchString] = useState("")
  const [previewResults, setPreviewResults] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [userLang, setUserLang] = useState("en")
  //const [userIp, setUserIp] = useState();http://www.geoplugin.net/json.gp?ip=93.227.112.181
  //const [userLonLat, setserLonLat] = useState([0,0]);
  const [searchTimer, setSearchTimer] = useState(0)

  const { map } = useContext(MapContext)

  const inputStyle = {
    borderRadius: "3px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    background: "none",
    padding: "2px 0",
    fontSize: "90%",
    position: "fixed",
    overflow: "auto",
    width: "100%",
    maxHeight: "50%", // TODO: don't cheat, let it flow to the bottom
  }

  function handleClick() {
    setIsMenuOpened({ isMenuOpened: !isMenuOpened });
  }

  function handleChange(event) {
    setSearchString(event.target.value)
    console.log("changed to:" + searchString)
    getPreviewResults(searchString)
  }

  function handleSelect(value) {
    setSearchString(value)
    getFinalResults(searchString)
    console.log(previewResults[0])
    let point = new Point([previewResults[0].geometry.coordinates[1],previewResults[0].geometry.coordinates[0]]);
    console.log(point)
    map.getView().fit(point, { 
      padding: [100, 100, 100, 100], 
  });
  }

  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }

  async function getPreviewResults(searchString) {
    const response = await fetch(`https://photon.komoot.io/api/?q=${searchString}&limit=5&lang=${userLang}`, requestOptions)
    const data = await response.json();
    setPreviewResults(data.features)
  }

  async function getFinalResults(searchString) {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${searchString}&limit=1&lang=${userLang}`,
      requestOptions
    )
    const data = await response.json()
    await setSearchResults(data.features[0])
    //[searchResults.geometry.coordinates[1],searchResults.geometry.coordinates[0]]
    map.getView().setCenter([[47,17]])
  }

  /*useEffect(() => {
    setUserLang(navigator.language || navigator.userLanguage)
  }, [userLang])*/

  /*useEffect(() => {
    //console.log(previewResults.length)
  }, [previewResults])*/

  function renderItem(item, isHighlighted) {
    return (
      <li
        key={item.properties.name}
        style={{
          background: isHighlighted ? "lightgray" : "white",
          listStyle: "none",
        }}
      >
        {item.properties.name}
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
    return <div children={items} />
  }

  return (
    <>
      <AutoCompleteContainer>
        <Autocomplete
          getItemValue={getItemValue}
          items={previewResults}
          renderItem={renderItem}
          value={searchString}
          onChange={handleChange}
          onSelect={handleSelect}
          renderInput={renderInput}
      />
      </AutoCompleteContainer>
    </>
  )
}

export default AutoComplete
