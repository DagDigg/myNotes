import React, { Component } from "react";
import { Alert } from "react-bootstrap";

export default class Error extends Component {
  render() {
    return (
      <Alert variant="danger">
        <Alert.Heading>Oops. Something went wrong</Alert.Heading>
        <p>{this.props.location.state.errDescription}</p>
      </Alert>
    );
  }
}
