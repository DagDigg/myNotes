import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      errDescription: ""
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

    this.setState({ isLoading: true });
    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false, errDescription: e.message });
    }
  };

  render() {
    return (
      <div className="Login">
        {this.state.errDescription ? (
          <Redirect
            to={{
              pathname: "/err",
              state: { errDescription: this.state.errDescription }
            }}
          />
        ) : (
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
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </FormGroup>
            <LoaderButton
              block
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Login"
              loadingText="Logging in..."
            />
          </form>
        )}
      </div>
    );
  }
}
