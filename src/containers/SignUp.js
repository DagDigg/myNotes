import React, { Component } from "react";
import {
  FormText,
  FormGroup,
  FormControl,
  FormLabel,
  Alert
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./SignUp.css";
import { Auth } from "aws-amplify";

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
    this.setState({ isValidPassword: true, isValidConfirmPassword: true });

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
      this.state.password.length >= 8 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

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

      this.props.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode">
          <FormLabel>Confirmation code:</FormLabel>
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
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password:</FormLabel>
          <FormControl
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          {!this.state.isValidPassword ? (
            <Alert variant="warning">
              Password should contain 8 characters, at least one uppercase
              letter, one lowercase letter, one number and one special character
            </Alert>
          ) : null}
        </FormGroup>
        <FormGroup controlId="confirmPassword">
          <FormLabel>Confirm password:</FormLabel>
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
    );
  }

  render() {
    return (
      <div className="SignUp">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
