import { config } from "config"

const md5 = require("md5")

export default async function handler(req, res) {
  const { osmId, osmType } = req.body
  const geocodingResponse = await fetch(
    `https://nominatim.openstreetmap.org/lookup?osm_ids=${osmType}${osmId}&format=json&extratags=1&addressdetails=1&accept-language=en&polygon_geojson=1&limit=1`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": config.email,
        "Cache-Control": "max-age=86400",
      },
    }
  ).catch(function (error) {
    console.log(error)
  })

  const geocodingData = await geocodingResponse.json()
  console.log(geocodingData)

  // wikimdata
  const wikidata = geocodingData[0].extratags.wikidata ? geocodingData[0].extratags.wikidata.replace(/^.+:/, "") : geocodingData[0].extratags["brand:wikipedia"]
  let wikiImageUrl
  const wikiResponse = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${wikidata}&format=json&origin=*`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": config.email,
      "Cache-Control": "max-age=86400",
    },
  }).catch(function (error) {
    console.log(error)
  })
  const wikiData = await wikiResponse.json()
  if (!wikiData && !wikiData.claims) {
    wikiImageUrl = "/assets/placeholder_image.jpg"
  } else {
    const imageName = wikiData.claims.P18[0].mainsnak.datavalue.value.replaceAll(" ", "_")
    const hash = md5(imageName)
    wikiImageUrl = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash[0]}${hash[1]}/${imageName}`
  }

  const wikiLang = geocodingData[0].extratags.wikipedia ? geocodingData[0].extratags.wikipedia.substr(0, geocodingData[0].extratags.wikipedia.indexOf(":")) : "en"
  const wikipedia = geocodingData[0].extratags.wikipedia
    ? geocodingData[0].extratags.wikipedia.replace(/^.+:/, "")
    : geocodingData[0].extratags["brand:wikipedia"]
    ? geocodingData[0].extratags["brand:wikipedia"]
    : null
  let wikipediaData
  let summary
  if (wikipedia) {
    const wikipediaRes = await fetch(
      `https://${wikiLang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&continue=&format=json&formatversion=2&format=json&titles=${wikipedia}&origin=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": config.email,
          "Cache-Control": "max-age=86400",
        },
      }
    ).catch(function (error) {
      console.log(error)
    })
    wikipediaData = await wikipediaRes.json()

    if (!wikipediaData.query || !wikipediaData.query.pages) {
      summary = null
    } else {
      summary = wikipediaData.query.pages[0].extract.toString()
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
    //image: wikiImageUrl,
    summary: summary,
    wikipediaLang: wikiLang,
    wikipediaLink: wikipedia ? wikiLang + ":" + wikipedia : null,
  })
}
