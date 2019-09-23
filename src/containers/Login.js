import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";
import { AuthContainer, Label } from "../components/StyledAuthentication";

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

  /**
   * Form validator. Returns true if email is > 0 and password > 8
   *
   * @return {Boolean}
   */
  validateForm = () => {
    return this.state.email.length > 0 && this.state.password.length >= 8;
  };

  /**
   * Handler for inputs. Sets the corrisponding id state to value
   * @param {Object} e Event Object
   */
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  /**
   * Submit handler. Signs in user with email and password
   * @param {Object} e Event Object
   */
  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ isLoading: true });
    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
    } catch (e) {
      alert(e);
      this.setState({
        isLoading: false,
        errDescription: e.message
      });
    }
  };

  render() {
    return (
      <AuthContainer>
        {this.state.errDescription ? (
          <Redirect
            to={{
              pathname: "/err",
              state: {
                errDescription: this.state.errDescription
              }
            }}
          />
        ) : (
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="email">
              <Label>Email</Label>
              <FormControl
                autoFocus
                type="email"
                key="email"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="password">
              <Label>Password</Label>
              <FormControl
                type="password"
                key="password"
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
      </AuthContainer>
    );
  }
}
