import React, { useState, useEffect, useContext } from "react"
import Map from "@/components/map"
import Autocomplete from "@/components/search/autocomplete"
import { fromLonLat } from "ol/proj"
import { Layers } from "components/layers"
import { OSMLayer } from "components/layers"
import Attribution from "@/components/attribution/attribution"
import { useRouter } from "next/router"
import MapContext from "@/components/map/mapContext"
import { XYZ } from "ol/source"
import { TileLayer } from "components/layers"

function Index() {
  const [center, setCenter] = useState([14, 46])
  const [zoom, setZoom] = useState(5)

  const OSMBrightSource = new XYZ({
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    tilePixelRatio: 2, // THIS IS IMPORTANT
  })

  const OSMBrightProperties = {
    name: "Stadia",
    attribution: `&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors`,
  }

  //properties={stadiaOSMBrightProps}
  return (
    <Map center={fromLonLat(center)} zoom={zoom}>
      <Autocomplete />
      <Layers>
        <TileLayer
          source={OSMBrightSource}
          properties={OSMBrightProperties}
          name="test"
        />
        <OSMLayer />
      </Layers>
      <Attribution />
    </Map>
  )
}

export default Index
