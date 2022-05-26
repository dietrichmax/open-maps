import Head from "next/head"
import { config } from "@config"

const SEO = () => {
  return (
    <Head>
      {/* META TAGS */}
      {/* General tags */}
      <title>{config.siteTitle}</title>
      <link rel="canonical" href={config.siteUrl} />
      <meta name="description" content={config.description} />
      <meta name="image" content={config.image} />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* OpenGraph tags */}
      <meta property="og:url" content={config.siteUrl} />
      <meta name="og:title" property="og:title" content={config.siteTitle} />
      <meta name="og:description" property="og:description" content={config.description} />
      <meta property="og:site_name" content={config.siteTitle} />
      <meta property="og:image" content={`${config.image}`} />

      {/* Twitter Card tags */}
      <meta name="twitter:title" content={config.siteTitle} />
      <meta name="twitter:description" content={config.description} />
      <meta name="twitter:image" content={config.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={config.socials.twitter} />
      <meta name="twitter:creator" content={config.socials.twitter} />
    </Head>
  )
}

export default SEO
