import React, { useState } from "react"
import Map from "@/components/map"
import Sidebar from "@/components/sidebar/sidebar"
import { fromLonLat } from "ol/proj"
import { Layers, TileLayer } from "components/layers"
import OSM from "ol/source/OSM"

function Index() {
  const [center, setCenter] = useState([0, 0])
  const [zoom, setZoom] = useState(3)

  return (
    <Map center={fromLonLat(center)} zoom={zoom}>
      <Sidebar />
      <Layers>
        <TileLayer source={new OSM()} zIndex={0} />
      </Layers>
    </Map>
  )
}

export default Index
