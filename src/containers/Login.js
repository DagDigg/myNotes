import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm = () => {
    return this.state.email.length > 0 && this.state.password.length >= 8;
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      await Auth.signIn(this.state.email, this.state.password);
      alert("Logged in!");
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email">
            <FormLabel className="label">Email</FormLabel>
            <FormControl
              autoFocus
              type="email"
              placeholder="Enter email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <FormLabel className="label">Password</FormLabel>
            <FormControl
              type="password"
              placeholder="Minimum 8 characters"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button block disabled={!this.validateForm()} type="submit">
            Login
          </Button>
        </form>
      </div>
    );
  }
}
