import React, { useState, useEffect, useContext } from "react"
import { FaLayerGroup } from "react-icons/fa"
import MapContext from "@/components/map/mapContext"
import styled from "styled-components"
import TileLayer from "ol/layer/Tile"
import { XYZ } from "ol/source"

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

  useEffect(() => {
    if (map) {
      setLayers(map.getLayers().getArray())
    }
  }, [map])

  const addGoogleLayer = () => {
    if (!map) return
    const googleHybridLayer = new TileLayer({
      source: new XYZ({
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      }),
      properties: {
        name: "Google Hybrid",
        attribution: `&copy; Google`,
      },
    })
    map.addLayer(googleHybridLayer)
    return () => {
      if (map) {
        map.removeLayer(googleHybridLayer)
      }
    }
  }

  const toggleLayer = (layers) => {
    layers[0].getVisible() === false
      ? layers[0].setVisible(true)
      : layers[0].setVisible(false)
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
