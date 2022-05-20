import { fetchGET } from "@/components/utils/fetcher"


export default async function handler(req, res) {
  const { lat, lon, input, limit, zoom } = req.body
  const encodedInput = encodeURI(input)
  const data = await fetchGET(`https://photon.komoot.io/api/?q=${encodedInput}&limit=${limit}&lang=en&lon=${parseInt(lon)}&lat=${parseInt(lat)}&zoom=${parseInt(zoom)}&location_bias_scale=0.4`)

  res.status(200).json(data)
}
