import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { Input } from "@/styles/templates/input"
import { Button } from "@/styles/templates/button"
import { FaSearch } from "react-icons/fa"
import { FiMenu } from "react-icons/fi"
import MapContext from "../map/mapContext"
import Sidebar from "@/components//sidebar"
import { fromLonLat } from "ol/proj"
import { transform } from "ol/proj"
import AutoComplete from "@/components/search/autocomplete"

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
`

const SearchButton = styled(Button)`
  display: flex;
  padding: 0.5rem .75rem;
`
function Search() {
  const [visible, setVisible] = useState(false)

  const handleClose = () => setShow(false)
  const handleClick = () => setShow(true)

  const { map } = useContext(MapContext)

  return (
    <>
      <SearchContainer>
        <AutoComplete />
        <SearchButton>
          <FaSearch />
        </SearchButton>
      </SearchContainer>
    </>
  )
}

export default Search
