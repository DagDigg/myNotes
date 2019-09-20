import styled from "styled-components";

export const AuthContainer = styled.div`
  padding: 60px 0;
  & form {
    margin: 0 auto;
    max-width: 320px;
  }
`;

export const Label = styled.span`
  color: ${props => props.theme.colors.secondaryText};
  display: block;
  text-align: left;
  margin-left: 3px;
`;
