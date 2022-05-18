import React, { useState, useEffect, useContext } from "react"
import Map from "@/components/map"
import Autocomplete from "@/components/search/autocomplete"
import { fromLonLat } from "ol/proj"
import { Layers } from "components/layers"
import { OSMLayer } from "components/layers"
import Attribution from "@/components/attribution/attribution"
import MapContext from "@/components/map/mapContext"
import { XYZ } from "ol/source"
import { TileLayer } from "components/layers"

function Index() {
  const [center, setCenter] = useState([14, 46])
  const [zoom, setZoom] = useState(5)

  //properties={stadiaGoogleHybridProps}
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
