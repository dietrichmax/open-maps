import React, { useState, useEffect } from "react"
import Map from "@/components/map"
import Autocomplete from "@/components/search/autocomplete"
import { fromLonLat } from "ol/proj"
import { Layers, TileLayer } from "components/layers"
import OSM from "ol/source/OSM"
import XYZ from "ol/source/XYZ"

import styled from "styled-components"

const Attribution = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  background-color: #fff;
  opacity: 0.7;
  font-size: 11px;
  padding-left: 5px;
`

function Index() {
  const [center, setCenter] = useState([14, 46])
  const [zoom, setZoom] = useState(5)

  /*useEffect(() => {
    getLocation()
  }, [])

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, handleError)
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  function handleError(error) {
    let errorStr
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorStr = "User denied the request for Geolocation."
        break
      case error.POSITION_UNAVAILABLE:
        errorStr = "Location information is unavailable."
        break
      case error.TIMEOUT:
        errorStr = "The request to get user location timed out."
        break
      case error.UNKNOWN_ERROR:
        errorStr = "An unknown error occurred."
        break
      default:
        errorStr = "An unknown error occurred."
    }
    console.error("Error occurred: " + errorStr)
  }

  function showPosition(position) {
    setCenter([position.coords.longitude, position.coords.latitude])
  }*/

  return (
    <Map center={fromLonLat(center)} zoom={zoom}>
      <Autocomplete />
      <Layers>
        <TileLayer source={new OSM()} zIndex={0} />
      </Layers>
      <Attribution>
        <div id="copyright">
          <a target="_blank" href="https://www.openstreetmap.org/">
            Map built with OpenStreetMap data
          </a>
          <span> | </span>
          <a
            rel="license"
            target="_blank"
            href="https://opendatacommons.org/licenses/odbl/"
          >
            Open Database License (ODbL)
          </a>
        </div>
      </Attribution>
    </Map>
  )
}

export default Index
