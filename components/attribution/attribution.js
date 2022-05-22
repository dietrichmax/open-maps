import React, { useState, useEffect, useContext } from "react"
import MapContext from "@/components/map/mapContext"
import styled from "styled-components"
import media from "styled-media-query"

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
  ${media.lessThan("432px")`
  `}
`
function Attribution({ y }) {
  const [attributionText, setAttributionText] = useState()
  const [attributionName, setAttributionName] = useState()

  const { map } = useContext(MapContext)

  const setAttribution = () => {
    const layers = map.getLayers().getArray()
    layers.map((layer) => {
      if (layer.getProperties().name === "OpenStreetMap") {
        setAttributionText(layer.getProperties().attribution)
        setAttributionName(layer.getProperties().name)
      }
    })
  }

  if (map) {
    map.on("postrender", setAttribution)
  }

  if (!map) return null
  return <AttributionContainer y={y} id="copyright" dangerouslySetInnerHTML={{ __html: attributionText }} title={attributionName} />
}
export default Attribution
