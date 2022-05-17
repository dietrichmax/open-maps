import OSM from "ol/source/OSM"
import TileLayer from "@/components/layers/tileLayer"

function OSMLayer() {
  const source = new OSM({
    tilePixelRatio: 2,
  })

  const properties = {
    name: "OpenStreetMap",
    attribution: `
    <a target="_blank" href="https://www.openstreetmap.org/">
      © OpenStreetMap contributors
    </a>`,
  }

  return <TileLayer source={new OSM()} zIndex={0} properties={properties} />
}

export default OSMLayer
