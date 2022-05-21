import styled from "styled-components"

const Input = styled.input`
position: relative;
  border: none;
  padding: 0 16px;
  font-size: 100%;
  border-radius: var(--border-radius);
  width: 100%;
  background-color: #f4f6fa;
  color: var(--text-color);
  height: 48px;
  width: 100%;
  border: none;
  :active {
    border: none;
  }
  :focus {
    box-shadow: none;
    outline-offset: 0px;
    outline: none;
  }
  
  ::placeholder {
    color: var(--gray);
  }
`

export { Input }
