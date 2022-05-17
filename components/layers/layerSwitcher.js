import React, { useState, useEffect, useContext } from "react"
import Map from "@/components/map"
import Autocomplete from "@/components/search/autocomplete"
import { fromLonLat } from "ol/proj"
import { Layers } from "components/layers"
import { OSMLayer } from "components/layers"
import Attribution from "@/components/attribution/attribution"
import { useRouter } from "next/router"
import { FaLayerGroup, FaEye, FaEyeSlash } from "react-icons/fa"
import MapContext from "@/components/map/mapContext"
import { XYZ } from "ol/source"
import { TileLayer } from "components/layers"
import styled from "styled-components"

const LayerSwitcherContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: var(--space-sm);
  left: ${(props) => props.sidebarVisible ? "432px" : "var(--space-sm)"};
  z-index: 1;
  cursor: pointer;
  background: rgba(255, 255, 255, 1);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding: var(--space-sm);
  height: 50px;
`

const LayerGroupContainer = styled.div`
  position: absolute;
  bottom: calc(50px + var(--space));
  left: var(--space-sm);
  z-index: 1;
  font-size: 20px;
  cursor: pointer;
  background: rgba(255, 255, 255, 1);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding: var(--space-sm);
  min-height: 50px;
  width: 150px;
  font-size: 11px;
  text-align: right;
`

const LayerGroupWrapper = styled.div`
  position: relative;
`

const LayerName = styled.p``

function LayerSwitcher({sidebarVisible}) {
  const [layers, setLayers] = useState()
  const [visible, setVisible] = useState(false)
  const [layerIsVisible, setLayerIsVisible] = useState(true)
  const [movePosition, setMovePosition] = useState(false)
  
  const { map } = useContext(MapContext)
  

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (map) {
      setLayers(map.getLayers().getArray())
    }
  }, [map])

  useEffect(() => {
    //console.log(layers)
  }, [layers])

  const handleVisability = () => {
    //console.log(visible)
    visible ? setVisible(false) : setVisible(true)
  }

  const toggleLayer = (layer) => {
    layer.getVisible() === true
      ? layer.setVisible(false)
      : layer.setVisible(true)
  }

  const getVisabilityIcon = (layer) => {
    if (layer.getVisible() === true) {
      return <FaEye onClick={() => toggleLayer(layer)} />
    } else {
      return <FaEyeSlash onClick={() => toggleLayer(layer)} />
    }
  }

  return (
    <>
      <LayerSwitcherContainer
        onClick={() => handleVisability()}
        title="Show layers"
        sidebarVisible={sidebarVisible}
      >
        <FaLayerGroup />
      </LayerSwitcherContainer>

      {visible ? (
        <LayerGroupContainer visible={visible}>
          <LayerGroupWrapper>
            {layers
              ? layers.map((layer) => {
                  return (
                    <LayerName key={layer.getProperties().name}>
                      {layer.getProperties().name} {getVisabilityIcon(layer)}
                    </LayerName>
                  )
                })
              : null}
          </LayerGroupWrapper>
        </LayerGroupContainer>
      ) : null}
    </>
  )
}

export default LayerSwitcher
