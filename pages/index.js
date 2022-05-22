import React, { useState, useEffect, useContext } from "react"
import Map from "@/components/map"
import Autocomplete from "@/components/search/autocomplete"
import { fromLonLat } from "ol/proj"
import { Layers } from "components/layers"
import { OSMLayer } from "components/layers"
import MapContext from "@/components/map/mapContext"
import { XYZ } from "ol/source"
import { TileLayer } from "components/layers"

function Index() {
  const [center, setCenter] = useState([14, 46])
  const [zoom, setZoom] = useState(5)

  //properties={stadiaGoogleHybridProps}
  return (
    <Map center={center} zoom={zoom} style={{position:'absolute',width:'100%',height:'100%'}}>
      <Autocomplete />
      {/*<Layers>
            <OSMLayer />
      </Layers>*/}
    </Map>
  )
}

export default Index
