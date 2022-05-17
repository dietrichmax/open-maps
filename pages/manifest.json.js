import React from "react"
import { config } from "config"

const createManifest = () =>
  `{
    "name": "${config.siteTitle}",
    "short_name": "${config.siteTitleShort}",
    "theme_color": "${config.themeColor}",
    "background_color": "${config.backgroundColor}",
    "start_url": "${config.homePath}",
    "display": "standalone",
    "orientation": "portrait",
    "icons": [
        {
          "src": "/assets/map-marker-icon.png",
          "type": "image/png",
          "sizes": "24x24",
          "purpose": "any maskable"
        }
    ]
}`

class Manifest extends React.Component {
  static async getInitialProps({ res }) {
    res.setHeader("Content-Type", "text/json")
    res.write(createManifest())
    res.end()
  }
}

export default Manifest
