import React, { useRef, useState, useEffect } from "react"
import MapContext from "./mapContext"
import View from "ol/View"
import Map from "ol/Map"
import { transform } from "ol/proj"

const MapWrapper = ({ children, zoom, center }) => {
  const mapRef = useRef()
  const [map, setMap] = useState(null)
  const [lon, setLon] = useState()
  const [lat, setLat] = useState()
  const [aZoom, setAZoom] = useState()

  const getHash = () => {
    if (window.location.hash.length === 0) return
    setLat(window.location.hash.substring(1, 8))
    setLon(window.location.hash.substring(9, 16))
    setAZoom(window.location.hash.substring(17, 20))
    // use regex
  }

  useEffect(() => {
    if (map) {
      map.getView().setCenter(transform([lon, lat], "EPSG:4326", "EPSG:3857"))
      map.getView().setZoom(aZoom)
    }
  }, [lat, lon, zoom])

  // on component mount
  useEffect(() => {
    getHash()
    let options = {
      view: new View({ zoom, center, maxZoom: 20 }),
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
