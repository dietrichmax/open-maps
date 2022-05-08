import { useContext, useEffect, useState } from "react"
import MapContext from "../map/mapContext"
import "ol/ol.css"
import Draw, { createBox, createRegularPolygon } from "ol/interaction/Draw"
import Polygon from "ol/geom/Polygon"
import { OSM, Vector as VectorSource } from "ol/source"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"

const DrawShapes = (type) => {
  const { map } = useContext(MapContext)

  const raster = new TileLayer({
    source: new OSM(),
  })

  const source = new VectorSource({ wrapX: false })

  const vector = new VectorLayer({
    source: source,
  })

  let draw // global so we can remove it later
  function addInteraction() {
    let value = type
    if (value !== "None") {
      let geometryFunction
      if (value === "Square") {
        value = "Circle"
        geometryFunction = createRegularPolygon(4)
      } else if (value === "Box") {
        value = "Circle"
        geometryFunction = createBox()
      }
      draw = new Draw({
        source: source,
        type: value,
        geometryFunction: geometryFunction,
      })
      map.addInteraction(draw)
    }
  }

  addInteraction()
}

export default DrawShapes
