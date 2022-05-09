import styled from "styled-components"

const BurgerWrapper = styled.button`
width: 25px;
height: 25px;
display: flex;
margin-right: var(--space-sm);
`

function Burger() {
  return (
    <BurgerWrapper title="Menu">
    </BurgerWrapper>
  )
}

export default Burger
