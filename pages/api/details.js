import { config } from "config"
const md5 = require("md5")
import { fetchGET } from "@/components/utils/fetcher"
import { useState } from "react"

export default async function handler(req, res) {
  const { osmId, osmType, query } = req.body

  let summary
  let image

  const geocodingData = await fetchGET(
    `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmType}${osmId}&format=json&extratags=1&addressdetails=1&accept-language=en&polygon_geojson=1&limit=1`
  )

  /*const filterData = (data) => {
    let set = []
    if (data) {
      set = data.filter((hit) => {  
        if (hit.type === "administrative" ) {
          return false
        } else if (hit.class === "boundary") {
          return false
        }
        return true
      })
      return set.slice(0, 7)
    }
  }

  filterData(geocodingData)*/

  const filteredGeocodingData = geocodingData

  const wikiLang =
    filteredGeocodingData[0] && filteredGeocodingData[0].extratags.wikipedia
      ? filteredGeocodingData[0].extratags.wikipedia.substr(0, filteredGeocodingData[0].extratags.wikipedia.indexOf(":"))
      : "en"
  const wikipediaTitle =
    filteredGeocodingData[0] && filteredGeocodingData[0].extratags.wikipedia
      ? filteredGeocodingData[0].extratags.wikipedia.replace(/^.+:/, "")
      : filteredGeocodingData[0] && filteredGeocodingData[0].extratags["brand:wikipedia"]
      ? filteredGeocodingData[0].extratags["brand:wikipedia"]
      : null
  const wikipediaLink = wikipediaTitle ? `${wikiLang}:${wikipediaTitle}` : null

  if (wikipediaTitle) {
    const wikipediaData = await fetchGET(
      `https://${wikiLang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext=1&exsentences=4&format=json&formatversion=2&format=json&titles=${wikipediaTitle}&origin=*`
    )
    if (wikipediaData) {
      summary = wikipediaData.query.pages[0].extract
    }
  }

  const openingHours = filteredGeocodingData[0].extratags.opening_hours
    ? filteredGeocodingData[0].extratags.opening_hours
        .replaceAll(",", ", ")
        .split(";")
        .map((item) => item.trim().replaceAll("-", " - "))
    : null

  res.status(200).json({
    display_name: filteredGeocodingData[0].display_name,
    osm_id: filteredGeocodingData[0].osm_id,
    osm_type: filteredGeocodingData[0].osm_type,
    type: filteredGeocodingData[0].type,
    boundingbox: filteredGeocodingData[0].boundingbox,
    lat: filteredGeocodingData[0].lat,
    lon: filteredGeocodingData[0].lon,
    address: filteredGeocodingData[0].address,
    geojson: filteredGeocodingData[0].geojson,
    information: {
      phone: filteredGeocodingData[0].extratags.phone ? filteredGeocodingData[0].extratags.phone : filteredGeocodingData[0].extratags["contact:phone"],
      website: filteredGeocodingData[0].extratags.website
        ? filteredGeocodingData[0].extratags.website
        : filteredGeocodingData[0].extratags["contact:website"]
        ? filteredGeocodingData[0].extratags["contact:website"]
        : filteredGeocodingData[0].extratags.url,
      email: filteredGeocodingData[0].extratags.email ? filteredGeocodingData[0].extratags.email : filteredGeocodingData[0].extratags["contact:email"],
      opening_hours: openingHours,
    },
    details: {
      wheelchair: filteredGeocodingData[0].extratags.wheelchair,
      cuisine: filteredGeocodingData[0].extratags.cuisine,
      takeaway: filteredGeocodingData[0].extratags.takeaway,
      outdoor_seating: filteredGeocodingData[0].extratags.outdoor_seating,
      internet_access: filteredGeocodingData[0].extratags.internet_access,
      bar: filteredGeocodingData[0].extratags.bar,
    },
    image: image,
    summary: summary,
    wikipediaLang: wikiLang,
    wikipediaLink: wikipediaLink,
    wikidata: filteredGeocodingData[0].extratags.wikidata,
  })
}
