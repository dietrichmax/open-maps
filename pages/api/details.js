import { config } from "config"
const md5 = require("md5")
import { fetchGET } from "@/components/utils/fetcher"
import { useState } from "react"

export default async function handler(req, res) {
  const { osmId, osmType } = req.body

  let summary
  let image = ""

  const geocodingData = await fetchGET(
    `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmType}${osmId}&format=json&extratags=1&addressdetails=1&accept-language=en&polygon_geojson=1&limit=1`
  )
  if (geocodingData && geocodingData[0].extratags && geocodingData[0].extratags.wikidata) {
    const wikidataEntity = geocodingData[0].extratags.wikidata.replace(/^.+:/, "")
    const wikidata = await fetchGET(`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${wikidataEntity}&format=json&origin=*`)
    if (wikidata) {
      const imageName = wikidata.claims.P18[0].mainsnak.datavalue.value.replaceAll(" ", "_")
      const hash = md5(imageName)
      image = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash[0]}${hash[1]}/${imageName}`
    } else {
      image = "/assets/placeholder_image.jpg"
    }
  }

  const wikiLang = geocodingData[0].extratags.wikipedia ? geocodingData[0].extratags.wikipedia.substr(0, geocodingData[0].extratags.wikipedia.indexOf(":")) : "en"
  const wikipediaTitle = geocodingData[0].extratags.wikipedia
    ? geocodingData[0].extratags.wikipedia.replace(/^.+:/, "")
    : geocodingData[0].extratags["brand:wikipedia"]
    ? geocodingData[0].extratags["brand:wikipedia"]
    : null
  const wikipediaLink = wikipediaTitle ? `${wikiLang}:${wikipediaTitle}` : null

  if (wikipediaTitle) {
    const wikipediaData = await fetchGET(
      `https://${wikiLang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&continue=&format=json&formatversion=2&format=json&titles=${wikipediaTitle}&origin=*`
    )
    if (wikipediaData) {
      summary = wikipediaData.query.pages[0].extract
    }
  }

  res.status(200).json({
    display_name: geocodingData[0].display_name,
    osm_id: geocodingData[0].osm_id,
    osm_type: geocodingData[0].osm_type,
    type: geocodingData[0].type,
    boundingbox: geocodingData[0].boundingbox,
    lat: geocodingData[0].lat,
    lon: geocodingData[0].lon,
    address: geocodingData[0].address,
    geojson: geocodingData[0].geojson,
    information: {
      phone: geocodingData[0].extratags.phone ? geocodingData[0].extratags.phone : geocodingData[0].extratags["contact:phone"],
      website: geocodingData[0].extratags.website
        ? geocodingData[0].extratags.website
        : geocodingData[0].extratags["contact:website"]
        ? geocodingData[0].extratags["contact:website"]
        : geocodingData[0].extratags.url,
      email: geocodingData[0].extratags.email ? geocodingData[0].extratags.email : geocodingData[0].extratags["contact:email"],
    },
    details: {
      wheelchair: geocodingData[0].extratags.wheelchair,
      cuisine: geocodingData[0].extratags.cuisine,
      takeaway: geocodingData[0].extratags.takeaway,
      outdoor_seating: geocodingData[0].extratags.outdoor_seating,
      opening_hours: geocodingData[0].extratags.opening_hours,
      internet_access: geocodingData[0].extratags.internet_access,
    },
    image: image,
    summary: summary,
    wikipediaLang: wikiLang,
    wikipediaLink: wikipediaLink,
    wikidata: geocodingData[0].extratags.wikidata,
  })
}
