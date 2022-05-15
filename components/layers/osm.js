import OSM from "ol/source/OSM"
import TileLayer from "@/components/layers/tileLayer"

function OSMLayer() {
  const properties = {
    name: "OpenStreetMap",
    attribution: `
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
    </a>`,
  }

  return <TileLayer source={new OSM()} zIndex={0} properties={properties} />
}

export default OSMLayer
