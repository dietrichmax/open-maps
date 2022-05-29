import React, { useState, useEffect, useContext } from "react"
import Map from "@/components/map"
import Autocomplete from "@/components/search/autocomplete"

function Index() {
  const [center, setCenter] = useState([14, 46])
  const [zoom, setZoom] = useState(0)

  useEffect(() => {
    const urlTemp = window.location.hash
    const urlParams = urlTemp.replace("#", "").split(",")
    if (urlParams.length < 3) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          setCenter([position.coords.longitude, position.coords.latitude])
          setZoom(9)
        })
      }
    }
    if ("AmbientLightSensor" in window) {
      const sensor = new AmbientLightSensor()
      sensor.addEventListener("reading", (event) => {
        alert("Current light level:", sensor.illuminance)
      })
      sensor.addEventListener("error", (event) => {
        alert(event.error.name, event.error.message)
      })
      sensor.start()
    }
  }, [])

  return (
    <Map center={center} zoom={zoom} style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Autocomplete />
      {/*<Layers>
            <OSMLayer />
      </Layers>*/}
    </Map>
  )
}

export default Index
