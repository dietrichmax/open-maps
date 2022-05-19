import React, { useCallback, useEffect, useState, useContext } from "react"
import styled from "styled-components"
import Logo from "@/components/logo/logo"
import BurgerIcon from "@/components/sidebar/burgerIcon"
import { DrawShapes } from "@/components/draw"
import media from "styled-media-query"
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import { Input } from "@/styles/templates/input"
import { transform } from "ol/proj"
import debounce from "lodash/debounce"
import { transformExtent } from "ol/proj"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import GeoJSON from 'ol/format/GeoJSON';
import { FaMapMarkerAlt, FaTrain } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import Details from "@/components/search/details/details"
import { push } from "@socialgouv/matomo-next"
import { Sidebar } from "@/components/sidebar"
import { result, set } from "lodash"
import MapContext from "@/components/map/mapContext"
import { fetchPOST } from "@/components/utils/fetcher"

const Container = styled.div`
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  z-index: 3;
  border-radius: var(--border-radius);
  background-color: var(--body-bg);
  display: flex;
  align-items: center;
  width: 400px;
  box-shadow: var(--box-shadow);
  ${media.lessThan("432px")`
  top: 0px;
  left: 0px;
    margin: 0;
    width: 100%;
    border-radius: 0;
  `}
`

// autocomplete

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
`

const SearchAction = styled.div`
  display: flex;
  font-size: 18px;
  padding: 1rem;
  padding-right: 1.25rem;
`

const AutoCompleteContainer = styled.div`
  width: 100%;
  font-size: 15px;
  margin-top: auto;
  margin-bottom: auto;
`

const AutoCompleteInputContainer = styled.div`
  display: flex;
  align-items: center;
`

const AutoCompleteInput = styled(Input)`
  width: 100%;
  font-size: 15px;
  padding-left: 1rem;
  max-width: 350px;
  padding: 0;
  ::placeholder {
    color: var(--gray);
  }
`

const SuggestionsContainer = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 64px;

  ${media.lessThan("432px")`
  top: 48px;
  `}
`

const ListContainer = styled.ol`
  list-style: none;
  padding-inline-start: 0;
  background-color: var(--body-bg);
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  border-radius: var(--border-radius);
  overflow: hidden;
  ${media.lessThan("432px")`
  border-radius: 0;
  `}
`

const ListItem = styled.li`
  align-items: baseline;
  padding-top: 6px;
  padding-bottom: 7px;
  padding-right: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  :hover {
    background-color: var(--border-color);
  }
`

const Place = styled.p`
  display: inline-block;
  font-size: 0.9rem;
  font-weight: bold;
`

const AdressDetail = styled.p`
  display: inline-block;
  font-size: 0.7rem;
  margin-left: 4px;
`

const SearchButtonWrapper = styled.div`
  display: flex;
  cursor: pointer;
  font-size: 18px;
  align-items: center;
  padding: 0;
  border: none;
  background: var(--body-bg);
  padding: 1rem;
  border-bottom-left-radius: var(--border-radius);
  border-top-left-radius: var(--border-radius);
`

const ButtonWrapper = styled.div`
  display: inline-block;
  width: 48px;
  text-align: center;
`

const DeleteSearchButtonWrapper = styled.div`
  display: flex;
`

const CloseButton = styled(ImCross)`
  cursor: pointer;
`

function Autocomplete() {
  const [visible, setVisible] = useState(false)
  const [zoom, setZoom] = useState(8)
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [extent, setExtent] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [name, setName] = useState()
  const [geocodingResult, setGeocodingResult] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [input, setInput] = useState("")
  const [markerLayer, setMarkerLayer] = useState()
  const [osm_id, setOsm_id] = useState()
  const [osm_type, setOsm_type] = useState()
  const [placeName, setPlaceName] = useState()
  const [gotFirstData, setGotFirstData] = useState(false)
  const [searchQuery, setSearchQuery] = useState(false)

  const { map } = useContext(MapContext)

  useEffect(() => {
    if (osm_id && osm_type) {
      setInput(placeName)
      setName(placeName)
      getGeocodingResults(osm_id, osm_type)
      setShowSuggestions(false)
      setShowResult(true)
    }
  }, [osm_id, osm_type, placeName])

  const updateHash = () => {
    const zoom = map.getView().getZoom().toFixed(2)
    const lonLat = transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326")

    const urlTemp = window.location.hash
    const urlParams = urlTemp.replace("#", "").split(",")
    if (!geocodingResult || (geocodingResult.length === 0 && urlParams.length < 4)) {
      window.location.hash = lonLat[1].toFixed(4) + "," + lonLat[0].toFixed(4) + "," + zoom
    } else if ((geocodingResult && geocodingResult.osm_id) || urlParams.length > 3) {
      const osmId = geocodingResult.osm_id ? geocodingResult.osm_id : urlParams[3]
      const osmType = geocodingResult.osm_type ? geocodingResult.osm_type[0].toUpperCase() : urlParams[4]
      const placeName = name ? name.replaceAll(" ", "+") : urlParams[5]
      if (urlParams.length > 3) {
        setOsm_id(osmId)
        setOsm_type(osmType)
        setPlaceName(placeName.replaceAll("+", " "))
      }
      window.location.hash = `${lonLat[1].toFixed(4)},${lonLat[0].toFixed(4)},${zoom},${osmId},${osmType},${placeName}`
    }
  }

  if (map) {
    map.on("moveend", updateHash)
  }

  const suggestionLimit = 30

  useEffect(() => {
    getOptions()
  }, [searchQuery])

  const getOptions = () => {
    if (map) {
      const center = transform(map.getView().getCenter(), "EPSG:3857", "EPSG:4326")
      setExtent(transformExtent(map.getView().calculateExtent(map.getSize()), "EPSG:3857", "EPSG:4326"))
      setLon(parseInt(center[0]))
      setLat(parseInt(center[1]))
      setZoom(parseInt(map.getView().getZoom() + 2))
    }
  }

  const handleVisability = () => {
    visible ? setVisible(false) : setVisible(true)
  }

  const handleChange = (e) => {
    setGotFirstData(false)
    setInput(e.target.value)
    setSearchQuery(e.target.value.replaceAll(",", "+").replaceAll(" ", "+").replaceAll("++", "+"))
  }

  useEffect(() => {
    !gotFirstData ? getFirstSuggestionResultsDelayed(lat, lon, searchQuery, suggestionLimit) : null
  }, [extent])

  const filterData = (data) => {
    let set = []
    if (data.features) {
      set = data.features.filter((hit) => {
        if (
          hit.properties.osm_value === "AdressDetail" ||
          hit.properties.osm_value === "continent" ||
          hit.properties.osm_value === "state" ||
          hit.properties.osm_value === "municipality"
        ) {
          return false
        } else if (hit.properties.type === "county" || hit.properties.type === "country") {
          return false
        } else if (hit.properties.osm_key === "boundary") {
          return false
        }
        return true
      })
      /*const lookup = set.reduce((a, e) => {
        a[e.name] = ++a[e.name] || 0;
        return a;
      }, {});
      set.filter(e => lookup[e.properties])*/
      return set.slice(0, 5)
    }
  }

  const selectResult = (searchTerm, osmId, osmType, name) => {
    setInput(searchTerm)
    setName(name)
    getGeocodingResults(osmId, osmType)
    setShowSuggestions(false)
    setShowResult(true)
  }

  const selectInput = () => {
    setName(name)
    getGeocodingResults(osmId, osmType)
    setShowSuggestions(false)
    setShowResult(true)
    push(["trackEvent", "search", searchTerm])
  }

  const deleteSearch = () => {
    setInput("")
    setGeocodingResult()
    setShowResult(false)
    removeGeojson()
  }

  const HandleSearch = () => {
    if (!showResult)
      return (
        /*<DeleteSearchButtonWrapper>
      <FaSearch 
          style={{ color: "var(--gray)", fontSize: "11px" }}
          title="Search"
          onClick={selectInput}/>
    </DeleteSearchButtonWrapper>*/
        null
      )
    return (
      <DeleteSearchButtonWrapper>
        <CloseButton style={{ color: "var(--gray)", fontSize: "11px" }} title="Delete search" onClick={deleteSearch} />
      </DeleteSearchButtonWrapper>
    )
  }

  const image = new CircleStyle({
    radius: 5,
    fill: null,
    stroke: new Stroke({color: 'red', width: 10}),
  });

  const styles = {
    'Point': new Style({
      image: image,
    }),
    'MultiPolygon': new Style({
      stroke: new Stroke({
        color: '#3f72af',
        width: 3,
      }),
    }),
    'Polygon': new Style({
      stroke: new Stroke({
        color: '#3f72af',
        width: 3,
      }),
    }),
  };

  const styleFunction = function (feature) {
    return styles[feature.getGeometry().getType()];
  };

  useEffect(() => {
    setShowSuggestions(false)
    if (geocodingResult && geocodingResult.boundingbox) {
      removeGeojson()
      const transformedBbox = transformExtent(
        [geocodingResult.boundingbox[2], geocodingResult.boundingbox[0], geocodingResult.boundingbox[3], geocodingResult.boundingbox[1]],
        "EPSG:4326",
        "EPSG:3857"
      )
      map.getView().fit(transformedBbox, {
        duration: 1000,
        padding: [100, 100, 100, 100],
      })
      addGeojson(geocodingResult)
    }
    setShowSuggestions(false)
    if (map) {
      updateHash()
    }
  }, [geocodingResult])

  const addGeojson = (geocodingResult) => {
    console.log(geocodingResult.geojson)
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geocodingResult.geojson,{ featureProjection: 'EPSG:3857' }),
    });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 3,
        style: styleFunction,
        properties: {
          name: "Geojson Layer",
        },
      })
      map.addLayer(vectorLayer)
    
  }

  const removeGeojson = () => {
    map.getLayers().forEach((layer) => {
      if (layer.get("name") === "Geojson Layer") {
        layer.getSource().clear()
      }
    })
  }

  const getFirstSuggestionResultsDelayed = useCallback(
    debounce((lat, lon, input, limit, callback) => {
      getFirstSuggestionResults(lat, lon, input, limit).then(callback)
    }, 200),
    []
  )

  async function getFirstSuggestionResults(lat, lon, input, limit) {
    if (!input || input.length < 1) return
    const data = await fetchPOST('/api/autocomplete', {lat, lon, input, limit, zoom})
    if (!data) {
      console.log("error")
    } else {
    setGotFirstData(true)
    const filteredData = filterData(data)
    setSuggestions(filteredData)
    setShowSuggestions(true)
      
  }
  }

  async function getGeocodingResults(osmId, osmType) {
    push(["trackEvent", "search", true])
    const data = await fetchPOST(`/api/details`, {osmId, osmType})
    if (!data) {
      console.log("error")
    } else {
      
    setGeocodingResult(data)
    setShowSuggestions(false)
    }
  }

  const getSymbol = (value) => {
    if (value === "train_station") {
      return <FaTrain />
    } else {
      return <FaMapMarkerAlt />
    }
  }

  const SuggestionsListComponent = () => {
    if (!suggestions || input.length === 0) {
      return
    } else {
      return suggestions.length ? (
        <SuggestionsContainer>
          <ListContainer Name="suggestions">
            {suggestions.map((suggestion, index) => {
              const searchTerm = `${
                suggestion.properties.name
                  ? suggestion.properties.name
                  : suggestion.properties.street
                  ? suggestion.properties.street
                  : suggestion.properties.housenumber
                  ? suggestion.properties.housenumber
                  : null
              }${suggestion.properties.city ? ", " + suggestion.properties.city : ""}`
              const name = suggestion.properties.name
              const osmId = suggestion.properties.osm_id
              const osmType = suggestion.properties.osm_type
              /*const secondPart = suggestion.properties.name.replace(
                capitalizeFirstLetter(input),
                ""
              )
              const firstPart = input*/
              return (
                <ListItem key={index} onClick={() => selectResult(searchTerm, osmId, osmType, name)}>
                  <ButtonWrapper>{getSymbol(suggestion.properties.osm_value)}</ButtonWrapper>
                  {suggestion.properties.name ? <Place>{`${suggestion.properties.name}`}</Place> : null}
                  {suggestion.properties.street ? <AdressDetail>{`${suggestion.properties.street} `}</AdressDetail> : null}
                  {suggestion.properties.housenumber ? <AdressDetail>{`${suggestion.properties.housenumber}`}</AdressDetail> : null}
                  {suggestion.properties.city ? <AdressDetail>{`${suggestion.properties.city}`}</AdressDetail> : null}
                  {suggestion.properties.country ? <AdressDetail>{`${suggestion.properties.country}`}</AdressDetail> : null}
                  {suggestion.properties.AdressDetail ? <AdressDetail>{suggestion.properties.AdressDetail}</AdressDetail> : null}
                </ListItem>
              )
            })}
          </ListContainer>
        </SuggestionsContainer>
      ) : null
    }
  }

  return (
    <>
      {visible ? <Sidebar visible={visible} /> : null}
      <>
        <Container>
          <SearchButtonWrapper onClick={() => handleVisability()}>
            <BurgerIcon />
          </SearchButtonWrapper>
          <SearchContainer>
            <AutoCompleteContainer>
              <AutoCompleteInputContainer>
                <AutoCompleteInput type="text" onChange={handleChange} value={input} placeholder="Search in mxd.codes Maps" />
              </AutoCompleteInputContainer>
              {showSuggestions ? <SuggestionsListComponent /> : null}
            </AutoCompleteContainer>
          </SearchContainer>
          <SearchAction>
            <HandleSearch />
          </SearchAction>
        </Container>
        {geocodingResult ? <Details result={geocodingResult} name={name} /> : null}
        {/*<LayerSwitcher sidebarVisible={showResult} />*/}
      </>
    </>
  )
}

export default Autocomplete
