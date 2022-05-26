import { useEffect } from "react"
import "@/styles/globals.css"
import "@/public/fonts/Quicksand/style.css"
import { config } from "config"
import Head from "next/head"
import { init } from "@socialgouv/matomo-next"
import App from "next/app"
import SEO from "@components/seo/seo"

import "maplibre-gl/dist/maplibre-gl.css"

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
        <Head>
          <meta name="application-name" content={config.siteTitle} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={config.siteTitle} />
          <meta name="description" content="Best PWA App in the world" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#000000" />

          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content={config.siteUrl} />
          <meta name="twitter:title" content={config.siteTitle} />
          <meta name="twitter:description" content={config.siteDescription} />
          <meta name="twitter:image" content="/assets/map-marker-icon.png" />
          <meta name="twitter:creator" content={config.twitter} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={config.siteTitle} />
          <meta property="og:description" content={config.siteDescription} />
          <meta property="og:site_name" content={config.siteTitle} />
          <meta property="og:url" content={config.siteUrl} />
          <meta property="og:image" content="/assets/map-marker-icon.png" />
        </Head>
        <SEO />
        <Component {...pageProps} />
      </>
    )
  }
}

export default MyApp
