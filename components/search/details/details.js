import styled from "styled-components"
import { useState, useEffect } from "react"
import { config } from "config"
import { FaRoute, FaDirections } from "react-icons/fa"

const DetailsWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    background-color: #fff;
    width: var(--sidebar-width);
    border: 0;
    box-shadow: 0 1px 2px rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
    opaCounty: 1;
    padding: 0 1rem 0 2rem;
`

const ImageWrapper = styled.div`
    display: block;
    width: 100%;
    height: 240px;
`

const Header = styled.div`
display: block;
padding-bottom: 1rem;
border-bottom: 1px solid var(--border-color);
`

const Title = styled.h1 `
    font-size: 1.375rem;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.75rem;
`

const Adress = styled.h2`
margin-top: 1rem;
    font-weight: 400;
`

const Country = styled.h2`
font-weight: 400;
`

const Actions = styled.div`
    display: flex;
`

const ActionWrapper = styled.div`
    display: flex;
    margin-top: 1rem;
    margin-right: 1rem;
    justify-content: space-between;
    cursor: pointer;
    border-radius: 40px;
    padding: 1rem;
    border: 1px solid var(--border-color);
    width: 50px;
    height: 50px;
    :hover {
        border: 1px solid var(--secondary-color);
    }
`


function Details({result}) {
    const [visible, setVisible] = useState(false)
    const [wikipediaData, setWikipediaData] = useState()
    const [gotWikipediaData, setGotWikipediaData] = useState(false)

    //console.log(result.properties)
    
    if (!result.properties) {
        return null
    }

    async function getWikipediaData(name) {
    
        if (!gotWikipediaData) {
        const encode = encodeURI(name)
        const res = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&section=0&prop=pageimages&format=json&origin=*&titles=${encode}`,
                {
                  method: "GET",
                  headers: { 
                      "Content-Type": "application/json" ,
                      "User-Agent"   : config.email
                },
                }
              )
              if (!res.ok) {
                throw new Error(res.statusText);
            } else {
                const data = await res.json()
                setWikipediaData(data)
                setGotWikipediaData(true)
            }
        }
    }

    //getWikipediaData()





  return (
  <DetailsWrapper>
      <ImageWrapper>


      </ImageWrapper>
      <Header>
        {result.properties.name ? <Title>{result.properties.name}</Title> : null }
        <Adress>            
            {result.properties.district ? `${result.properties.district},` : null}
            {result.properties.street ? ` ${result.properties.street} ` : null}
            {result.properties.housenumber ? ` ${result.properties.housenumber},` : null}
            {result.properties.postcode ? ` ${result.properties.postcode}` : null}
            {result.properties.city ? ` ${result.properties.city},` : null}
            {result.properties.country ? ` ${result.properties.country}` : null}
        </Adress>
      </Header>
      <Actions> 
        <ActionWrapper> 
            <FaDirections />
        </ActionWrapper> 
        <ActionWrapper> 
            <FaRoute />
        </ActionWrapper> 

      </Actions>
          {/*{wikipediaData ? 
            <div dangerouslySetInnerHTML={{__html: wikipediaData.parse.text["*"]}} /> 
            
        : null}*/}
  </DetailsWrapper>
  )
}

export default Details

