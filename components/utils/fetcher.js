import { config } from "config"

export async function fetchGETCache(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": config.email,
        "Cache-Control": "max-age=86400",
      },
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function fetchGET(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": config.email
      },
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function fetchPOST(url, body) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}
