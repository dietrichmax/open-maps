import React, { useRef, useState, useEffect } from "react"
import MapContext from "./mapContext"
import View from "ol/View"
import Map from "ol/Map"

const MapWrapper = ({ children, zoom, center }) => {
  const mapRef = useRef()
  const [map, setMap] = useState(null)

  // on component mount
  useEffect(() => {
    let options = {
      view: new View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: [],
    }

    let mapObject = new Map(options)
    mapObject.setTarget(mapRef.current)
    setMap(mapObject)

    return () => mapObject.setTarget(undefined)
  }, [])

  // zoom change handler
  useEffect(() => {
    if (!map) return
    map.getView().setZoom(zoom)
  }, [zoom])

  // center change handler
  useEffect(() => {
    if (!map) return
    map.getView().setCenter(center)
  }, [center])

  useEffect(() => {
    if (!map) return
    map.on("click", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature
      })
      if (feature) {
        console.log("click")
      }
    })

    // change mouse cursor when over marker
    map.on("pointermove", function (e) {
      const pixel = map.getEventPixel(e.originalEvent)
      const hit = map.hasFeatureAtPixel(pixel)
      map.getTarget().style.cursor = hit ? "pointer" : ""
    })
  }, [map])

  return (
    <MapContext.Provider value={{ map }}>
      <div
        ref={mapRef}
        className="ol-map"
        style={{ height: "100vh", width: "100%", position: "relative" }}
      >
        {children}
      </div>
    </MapContext.Provider>
  )
}

export default MapWrapper
