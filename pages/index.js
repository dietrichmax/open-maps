import React, { useState, useEffect, useContext } from "react"
import Map from "@/components/map"
import Autocomplete from "@/components/search/autocomplete"
import { fromLonLat } from "ol/proj"
import { Layers } from "components/layers"
import { OSMLayer } from "components/layers"
import Attribution from "@/components/attribution/attribution"
import { useRouter } from "next/router"
/*const router = useRouter();
router.query.NEWPARAMS = "VALUE"
router.push(router)*/
function Index() {
  const [center, setCenter] = useState([14, 46])
  const [zoom, setZoom] = useState(5)

  /*function getLocation() {
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
        <OSMLayer />
      </Layers>
      <Attribution />
    </Map>
  )
}

export default Index
