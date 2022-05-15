import React, { useState, useEffect, useContext } from "react"
import MapContext from "@/components/map/mapContext"
import styled from "styled-components"

const AttributionContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  background-color: #fff;
  opacity: 0.7;
  font-size: 11px;
  padding-left: 5px;
  padding-right: 5px;
`
function Attribution() {
  const [attributionText, setAttributionText] = useState(`
    <a target="_blank" href="https://www.openstreetmap.org/">
        OpenStreetMap contributors
    </a>
    <span> | </span>
    <a
        rel="license"
        target="_blank"
        href="https://opendatacommons.org/licenses/odbl/"
    >
        Open Database License (ODbL)
    </a>`)
  const [layers, setLayers] = useState()

  const { map } = useContext(MapContext)

  useEffect(() => {
    if (map) {
      setLayers(map.getLayers().getArray())
    }
  }, [])

  useEffect(() => {
    console.log(layers)
    //setAttributionText(layers[0].getProperties().attribution)
  }, [layers])

  if (!map) return null
  return (
    <AttributionContainer
      id="copyright"
      dangerouslySetInnerHTML={{ __html: attributionText }}
    />
  )
}
export default Attribution
