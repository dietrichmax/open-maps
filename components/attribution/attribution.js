import React, { useState, useEffect, useContext } from "react"
import MapContext from "@/components/map/mapContext"
import styled from "styled-components"

const AttributionContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  background: rgba(255,255,255,.6);
  font-size: 11px;
  padding-left: 5px;
  padding-right: 5px;
`
function Attribution() {
  const [attributionText, setAttributionText] = useState()
  const [layers, setLayers] = useState()

  const { map } = useContext(MapContext)

  useEffect(() => {
    if (map) {
      setLayers(map.getLayers().getArray())
    }
  }, [map])

  useEffect(() => {
    if (layers) {
      setAttributionText(layers[0].getProperties().attribution)
    }
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
