import React, { useState, useEffect, useContext } from "react"
import { FaLayerGroup, FaEye, FaEyeSlash } from "react-icons/fa"
import MapContext from "@/components/map/mapContext"
import styled from "styled-components"

const LayerSwitcherContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: var(--space-sm);
  left: ${(props) => (props.sidebarVisible ? "432px" : "var(--space-sm)")};
  z-index: 1;
  cursor: pointer;
  background: rgba(255, 255, 255, 1);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding: var(--space-sm);
  height: 50px;
`


function LayerSwitcher({ sidebarVisible }) {
  const [layers, setLayers] = useState()

  const { map } = useContext(MapContext)

  useEffect(() => {}, [])

  useEffect(() => {
    if (map) {
      setLayers(map.getLayers().getArray())
    }
  }, [map])


  const toggleLayer = (layers) => {
    if (layers[0].getVisible() === true) {
      layers[0].setVisible(false)
      layers[1].setVisible(true)
    } else {
      layers[0].setVisible(true)
      layers[1].setVisible(false)
    }
  }


  return (
      <LayerSwitcherContainer
        onClick={() => toggleLayer(layers)}
        title="Show layers"
        sidebarVisible={sidebarVisible}
      >
        <FaLayerGroup />
      </LayerSwitcherContainer>
  )
}

export default LayerSwitcher
