import useSWR from "swr"
import { fetchGET } from "@/components/utils/fetcher"
import { config } from "config"

//const { data } = useSWR('/api/unsplash', fetchGET);

export default async function handler(req, res) {
  const { lat, lon, input, limit, zoom } = req.body
  const encodedInput = encodeURI(input)
  const response = await fetch(`https://photon.komoot.io/api/?q=${encodedInput}&limit=${limit}&lang=en&lon=${lon}&lat=${lat}&zoom=${zoom - 8}&location_bias_scale=0.6`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": config.email,
      "Cache-Control": "max-age=86400",
    },
  })
  const data = await response.json()
  res.status(200).json(data)
}