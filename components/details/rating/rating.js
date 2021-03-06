import styled from "styled-components"
import { useState, useEffect } from "react"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import media from "styled-media-query"
import { fetchGET } from "@/components/utils/fetcher"
import { fetchPOST } from "@/components/utils/fetcher"

const FeedbackContainer = styled.div`
  margin-top: 0.5rem;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  padding: 1rem var(--space);

  ${media.lessThan("432px")`
  margin-top: 0;
  border-top: none;
  display: block;
  order: 2;
  `}
`

const FeedbackWrapperContainer = styled.div`
  display: flex;
`

const FeedbackWrapper = styled.button`
  border: 1px solid var(--border-color);
  display: flex;
  border-radius: var(--border-radius);
  background: var(--content-bg);
  cursor: pointer;
  margin-left: 1rem;
  padding: 0.75rem;
  transition: 0.2s;
  :hover {
    background: var(--border-coor);
    opacity: 0.8;
  }
`

const FeedbackResult = styled.div`
  align-items: center;
  font-size: 0.95rem;
`

const ActionsResponsiveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

function Rating({ result }) {
  const [osmId, setOsmId] = useState()
  const [upvotes, setUpvotes] = useState(1)
  const [downvotes, setDownvotes] = useState(1)
  const [votesChanged, setVotesChanged] = useState(false)
  const [percent, setPercent] = useState(100)

  useEffect(() => {
    setOsmId(result.osm_id)
  }, [result])

  useEffect(() => {
    if (osmId) {
      //getRating(osmId)
    }
  }, [osmId])

  async function getRating(osmId) {
    const data = await fetchGET(`/api/poi_details/${parseInt(osmId)}`)
    setUpvotes(!data ? 0 : data.upvotes)
    setDownvotes(!data ? 0 : data.downvotes)
  }

  useEffect(() => {
    votesChanged ? sendRating(osmId, upvotes, downvotes) : null
  }, [votesChanged, downvotes, upvotes])

  useEffect(() => {
    const ratio = upvotes / downvotes
    setPercent(ratio * 100 > 100 || isNaN(ratio) ? 100 : parseInt(ratio * 100))
  }, [downvotes, upvotes])

  const handleRating = (string) => {
    if (string === "upvote") {
      setUpvotes((prevUpvotes) => prevUpvotes + 1)
    } else if (string === "downvote") {
      setDownvotes((prevDownvotes) => prevDownvotes + 1)
    }
    setVotesChanged(true)
  }

  async function sendRating(osmId, upvotes, downvotes) {
    const body = { osmId, upvotes, downvotes }
    const data = await fetchPOST(`/api/poi_details`, body)
    if (!data) {
      console.log("error")
    }
    setVotesChanged(false)
  }

  if (result.length === 0) {
    return null
  } else {
    return (
      <FeedbackContainer>
        <ActionsResponsiveContainer>
          <FeedbackResult>{percent}% liked this place</FeedbackResult>
          <FeedbackWrapperContainer>
            <FeedbackWrapper onClick={() => handleRating("upvote")} title="Upvote this place">
              <FaThumbsUp style={{ color: "var(--success-color)" }} />
            </FeedbackWrapper>
            <FeedbackWrapper onClick={() => handleRating("downvote")} title="Downvote this place">
              <FaThumbsDown style={{ color: "var(--failure-color)" }} />
            </FeedbackWrapper>
          </FeedbackWrapperContainer>
        </ActionsResponsiveContainer>
      </FeedbackContainer>
    )
  }
}

export default Rating
