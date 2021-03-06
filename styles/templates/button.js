import styled from "styled-components"

const Button = styled.button`
  border: none;
  width: auto !important;
  text-transform: uppercase;
  outline: none;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  text-align: center;
  padding: 0.5rem 1.25rem;
  width: 20%;
  border-radius: var(--border-radius);
  color: ${(props) => (props.color ? `${props.color}` : "var(--text-color)")};
  background: ${(props) => (props.backgroundColor ? `${props.backgroundColor}` : "none")};
  cursor: pointer;
  :hover {
    background-color: ${(props) => (props.backgroundColor ? `${props.backgroundColor}` : "none")};
  }
  :disabled {
    cursor: not-allowed;
    opacity: 0.75;
  }
`

export { Button }
