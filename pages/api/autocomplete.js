import useSWR from "swr"
import { fetchGET } from "@/components/utils/fetcher"
import { config } from "config"

//const { data } = useSWR('/api/unsplash', fetchGET);

export default async function handler(req, res) {
  const { lat, lon, input, limit, zoom } = req.body
  const encodedInput = encodeURI(input)

  const data = await fetchGET(`https://photon.komoot.io/api/?q=${encodedInput}&limit=${limit}&lang=en&lon=${lon}&lat=${lat}&zoom=${zoom - 8}&location_bias_scale=0.6`)

  res.status(200).json(data)
}
