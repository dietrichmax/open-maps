import React, { useRef, useState, useEffect } from "react"
import MapContext from "./mapContext"
import View from "ol/View"
import Map from "ol/Map"
import { transform } from "ol/proj"
import styled from "styled-components"
import media from "styled-media-query"
import maplibregl from "maplibre-gl"

const MapContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  ${media.lessThan("432px")`  
  overflow: hidden;
  `}
`

const MapWrapper = ({ children, zoom, center }) => {
  const mapContainerRef = useRef()
  const [map, setMap] = useState(null)
  const [lon, setLon] = useState()
  const [lat, setLat] = useState()
  const [aZoom, setAZoom] = useState()
  const [aLayer, setALayer] = useState()

  const getHash = () => {
    if (window.location.hash.length === 0) return
    const parameters = window.location.hash.replace("#", "").split(",")
    setLat(parameters[0])
    setLon(parameters[1])
    setAZoom(parameters[2])
  }

  useEffect(() => {
    if (map) {
      map.setZoom(aZoom)
      map.setCenter([lon, lat])
    }
  }, [lat, lon, aZoom])

  // on component mount
  useEffect(() => {
    getHash()
    const mapObject = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: center,
      zoom: zoom,
      attributionControl: false
    })
    /*mapObject.addControl(new maplibregl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
      }), "bottom-right")*/
    mapObject.addControl(new maplibregl.AttributionControl({
      compact: true,
      customAttribution: '<a href="https://mxd.codes" title="mxd.codes" >mxd.codes</a>'
      }));
    setMap(mapObject)
    return () => {
      mapObject.remove()
    }
  }, [])

  // zoom change handler
  useEffect(() => {
    if (!map) return
    map.setZoom(zoom)
  }, [zoom])

  // center change handler
  useEffect(() => {
    if (!map) return
    map.setCenter(center)
  }, [center])

  useEffect(() => {
    if (!map) return
  }, [map])

  return (
    <MapContext.Provider value={{ map }}>
      <MapContainer ref={mapContainerRef} className="ol-map">
        {children}
      </MapContainer>
    </MapContext.Provider>
  )
}

export default MapWrapper
