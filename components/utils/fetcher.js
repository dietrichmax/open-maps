import { config } from "config"

export async function fetchGET(url) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": config.email,
    },
  })
  if (!res.ok) {
    throw new Error(res.statusText)
  } else {
    return res.json()
  }
}

export async function fetchPOST(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": config.email,
      "body": JSON.stringify(body),
    },
  })
  if (!res.ok) {
    throw new Error(res.statusText)
  } else {
    return res.json()
  }
}
