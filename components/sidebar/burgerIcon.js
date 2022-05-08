import styled from "styled-components"

const BurgerWrapper = styled.button`
  margin-right: 1rem;
`

const BurgerIcon = styled.span`
  display: block;
  background: #555;
  width: 20px;
  height: 4px;
  position: relative;
  margin: 3px;
  border-radius: 4px;
`

function Burger() {
  return (
    <BurgerWrapper title="Menu">
      <BurgerIcon />
      <BurgerIcon />
      <BurgerIcon />
    </BurgerWrapper>
  )
}

export default Burger
