import { useEffect } from "react"
import "@/styles/globals.css"
import "@/public/fonts/Quicksand/style.css"
import { config } from "config"
import Head from "next/head"
import { init } from "@socialgouv/matomo-next"
import App from "next/app"

class MyApp extends App {
  componentDidMount() {
    if (window.location.href.includes(config.domain)) {
      init({
        url: process.env.NEXT_PUBLIC_MATOMO_URL,
        siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
      }),
        window._paq.push(["enableHeartBeatTimer"])
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Component {...pageProps} />
      </>
    )
  }
}

export default MyApp
