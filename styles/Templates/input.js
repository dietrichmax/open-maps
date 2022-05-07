import styled from "styled-components"

const Input = styled.input`
  border: none;
  background-color: var(--body-bg);
  color: var(--text-color);
  width: 100%;
  :active {
    border: none;
  }
  :focus {
    border: none;
    box-shadow: none;
    outline-offset: 0px;
    outline: none;
  }
`

export { Input }
