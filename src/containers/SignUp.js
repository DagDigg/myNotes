import React, { Component } from "react";
import { FormText, FormGroup, FormControl, Alert } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { AuthContainer, Label } from "../components/StyledAuthentication";
import { Auth } from "aws-amplify";
import { postInitialTable } from "../API/tablesAPI";
import * as COSTANTS from "../config";

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.timeout = null;

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      isValidPassword: true,
      isValidConfirmPassword: true,
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validatePassword = id => {
    const regex = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    );
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

    window.clearTimeout(this.timeout);
    this.setState({
      isValidPassword: true,
      isValidConfirmPassword: true
    });

    id === "password"
      ? (this.timeout = window.setTimeout(() => {
          if (!password.match(regex) && password) {
            this.setState({ isValidPassword: false });
          }
        }, 1500))
      : (this.timeout = window.setTimeout(() => {
          if (password !== confirmPassword) {
            this.setState({ isValidConfirmPassword: false });
          }
        }, 1500));
  };

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length >= COSTANTS.MIN_PASSWORD_LENGTH &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  /**
   * Handler for inputs. Sets the corrisponding id state to value
   * @param {Object} e Event Object
   */
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handlePasswordChange = e => {
    e.preventDefault();
    let id = e.target.id;
    this.setState(
      {
        [e.target.id]: e.target.value
      },
      () => this.validatePassword(id)
    );
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({ newUser });
    } catch (e) {
      if (e.name === "UsernameExistsException") {
        try {
          const newUser = await Auth.resendSignUp(this.state.email);
          this.setState({ newUser });
        } catch (e) {
          alert(e.message);
        }
      }
    }
    this.setState({ isLoading: false });
  };

  handleConfirmationSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
      await postInitialTable();

      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  renderConfirmationForm() {
    return (
      <AuthContainer>
        <form onSubmit={this.handleConfirmationSubmit}>
          <FormGroup controlId="confirmationCode">
            <Label>Confirmation code:</Label>
            <FormControl
              autoFocus
              type="tel"
              value={this.state.confirmationCode}
              onChange={this.handleChange}
            />
            <FormText className="text-muted">
              Please check your email and paste the received code
            </FormText>
          </FormGroup>
          <LoaderButton
            block
            text="Verify"
            disabled={!this.validateConfirmationForm()}
            type="submit"
            isLoading={this.state.isLoading}
            loadingText="Verifying..."
          />
        </form>
      </AuthContainer>
    );
  }

  renderForm() {
    return (
      <AuthContainer>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email">
            <Label>Email</Label>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <Label>Password:</Label>
            <FormControl
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            {!this.state.isValidPassword ? (
              <Alert variant="warning" style={{ margin: "20px 0" }}>
                Password should contain 8 characters, at least one uppercase
                letter, one lowercase letter, one number and one special
                character
              </Alert>
            ) : null}
          </FormGroup>
          <FormGroup controlId="confirmPassword">
            <Label>Confirm password:</Label>
            <FormControl
              type="password"
              value={this.state.confirmPassword}
              onChange={this.handlePasswordChange}
            />
            {!this.state.isValidConfirmPassword ? (
              <Alert variant="warning">Passwords should match</Alert>
            ) : null}
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            disabled={!this.validateForm()}
            isLoading={this.state.isLoading}
            text="Signup"
            loadingText="Signing up..."
          />
        </form>
      </AuthContainer>
    );
  }

  render() {
    return (
      <div>
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
