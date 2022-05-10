import { useEffect } from "react"
import "@/styles/globals.css"
import "@/public/fonts/Quicksand/style.css"
import { config } from "config"
import Head from "next/head"
import { init } from "@socialgouv/matomo-next"


function MyApp({ Component, pageProps }) {

  useEffect(() => {
    if (window.location.href.includes(config.domain)) {
      init({
        url: process.env.NEXT_PUBLIC_MATOMO_URL,
        siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
      }),
        window._paq.push(["enableHeartBeatTimer"])
    }
  }, [])
  
  return (
    <>
      <Component {...pageProps} />
      </>
  )
}

export default MyApp
