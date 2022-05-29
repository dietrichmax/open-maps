import { fetchGET } from "@/components/utils/fetcher"

export default async function handler(req, res) {
  const { lat, lon, input, limit, zoom } = req.body
  const encodedInput = encodeURI(input)
  const data = await fetchGET(
    `https://photon.komoot.io/api/?q=${encodedInput}&limit=${limit}&lang=en&lon=${parseInt(lon)}&lat=${parseInt(lat)}&zoom=${parseInt(zoom)}&location_bias_scale=0.4`
  )

  const filterData = (data) => {
    let set = []
    if (data.features) {
      set = data.features.filter((hit) => {
        if (hit.properties.osm_value === "continent" || hit.properties.osm_value === "state") {
          return false
        } else if (hit.properties.type === "county" || hit.properties.type === "country" || hit.properties.type === "administrative") {
          return false
        } else if (hit.properties.osm_type === "relation") {
          return false
        }
        return true
      })
      return set.slice(0, 7)
    }
  }

  const filteredData = filterData(data)

  res.status(200).json(filteredData)
}
