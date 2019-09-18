import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import "./LoaderButton.css";
import styled from "styled-components";

export default ({
  isLoading,
  text,
  loadingText,
  disabled = false,
  ...props
}) => {
  const Button = styled.button`
    width: 240px;
    height: 50px;

    justify-content: center;
    margin: 50px auto;
    border: 2px solid ${props => props.theme.colors.buttonColor};
    background-color: transparent;
    border-radius: 10px;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    color: ${props => props.theme.colors.secondaryText};

    &:disabled {
      border-color: ${props => props.theme.colors.disabledColor};
      color: ${props => props.theme.colors.disabledColor};
    }

    &:hover:enabled {
      background-color: ${props => props.theme.colors.buttonColor};
      color: white;
    }
    &:enabled {
      border-color: ${props => props.theme.colors.buttonColor};
      color: ${props => props.theme.colors.secondaryText};
    }
    & div {
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  `;
  return (
    <Button disabled={disabled || isLoading} {...props}>
      <div>
        {isLoading && (
          <FontAwesomeIcon icon={faSync} size="lg" className="loaderButton" />
        )}
        {isLoading ? loadingText : text}
      </div>
    </Button>
  );
};
