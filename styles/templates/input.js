import styled from "styled-components"

const Input = styled.input`
  border: none;
  padding: 3px 5px;
  background-color: var(--body-bg);
  font-size: 100%;
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
