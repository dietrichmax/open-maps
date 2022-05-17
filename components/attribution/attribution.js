import React, { useState, useEffect, useContext } from "react"
import MapContext from "@/components/map/mapContext"
import styled from "styled-components"

const AttributionContainer = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding: 3px 5px;
`
function Attribution() {
  const [attributionText, setAttributionText] = useState()
  const [attributionName, setAttributionName] = useState()
  const [layers, setLayers] = useState()

  const { map } = useContext(MapContext)

  useEffect(() => {
    if (map) {
      setLayers(map.getLayers().getArray())
    }
  }, [map])

  useEffect(() => {
    if (layers) {
      setAttributionText(
        layers[0] ? layers[0].getProperties().attribution : null
      )
      setAttributionName(layers[0] ? layers[0].getProperties().name : null)
    }
  }, [layers])

  if (!map) return null
  return (
    <AttributionContainer
      id="copyright"
      dangerouslySetInnerHTML={{ __html: attributionText }}
      title={attributionName}
    />
  )
}
export default Attribution
