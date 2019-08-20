import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import "./LoaderButton.css";
export default ({
  isLoading,
  text,
  loadingText,
  disabled = false,
  ...props
}) => (
  <Button variant="flat" disabled={disabled || isLoading} {...props}>
    <div>
      {isLoading && (
        <FontAwesomeIcon icon={faSync} size="lg" className="loaderButton" />
      )}
      {isLoading ? loadingText : text}
    </div>
  </Button>
);
