import React, { useState, useEffect, useContext } from "react"
import { FaLayerGroup } from "react-icons/fa"
import MapContext from "@/components/map/mapContext"
import styled from "styled-components"
import TileLayer from "ol/layer/Tile"
import { XYZ } from "ol/source"
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import {Fill, Icon, Stroke, Style, Text} from 'ol/style';
import apply from 'ol-mapbox-style';

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
      addVectorLayer()
    }
  }, [map])

  const addVectorLayer = () => {
    if (!map) return
    const styleJson = "https://api.maptiler.com/maps/openstreetmap/style.json?key=KgUIFOAvg8EQYAVIO2oy"
    const vectorLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: 'https://api.maptiler.com/tiles/v3-lite/{z}/{x}/{y}.pbf?key=KgUIFOAvg8EQYAVIO2oy',
      })
    })
    apply(map, styleJson)
    return () => {
      if (map) {
        map.removeLayer(vectorLayer )
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
