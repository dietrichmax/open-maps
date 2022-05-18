import { useContext, useEffect, useState } from "react"
import MapContext from "../map/mapContext"
import "ol/ol.css"
import Draw, { createBox, createRegularPolygon } from "ol/interaction/Draw"
import Polygon from "ol/geom/Polygon"
import { OSM, Vector as VectorSource } from "ol/source"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"

class DrawShapes {
  constructor(map) {
    this.map = map
    this.draw
  }

  /*

  let draw // global so we can remove it later*/
  addInteraction(type) {
    let value = type

    const source = new VectorSource({ wrapX: false })

    const vector = new VectorLayer({
      source: source,
    })
    if (value !== "None") {
      let geometryFunction
      if (value === "Square") {
        value = "Circle"
        geometryFunction = createRegularPolygon(4)
      } else if (value === "Box") {
        value = "Circle"
        geometryFunction = createBox()
      }
      this.draw = new Draw({
        source: source,
        type: value,
      })
      this.map.addLayer(vector)
      this.map.addInteraction(this.draw)
    }
  }

  removeInteraction() {
    console.log("sd")
    this.map.removeInteraction(this.draw)
  }
}

export default DrawShapes
