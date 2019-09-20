import styled from "styled-components";

export const Group = styled.div`
  width: 100%;
  padding: 0 20px;
  margin: 20px 0;
`;

export const Label = styled.h3`
  text-align: left;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.secondaryText};
`;

export const InputText = styled.textarea`
  resize: vertical;
  width: 100%;
  padding: 10px;
  margin-bottom: 50px;
  border-radius: 10px;
  min-height: 100px;
  border: none;
  outline: none;
  box-shadow: none;
`;

export const InputFile = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

export const LabelFile = styled.label`
  font-size: 1.25em;
  display: block;
  width: 140px;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 2px solid ${props => props.theme.colors.buttonColor};
  color: ${props => props.theme.colors.secondaryText};
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  &:focus,
  &:hover {
    background-color: ${props => props.theme.colors.buttonColor};
    color: white;
  }
`;

export const FileText = styled.p`
  font-size: 16px;
  text-align: left;
`;
