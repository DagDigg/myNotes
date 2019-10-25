import React, { useState } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { Auth } from "aws-amplify";
import { Redirect } from "react-router-dom";
import { AuthContainer, Label } from "../components/StyledAuthentication";
import * as COSTANTS from "../config";
import useLoginForm from "../hooks/useLoginForm";

const Login = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [errDescription, setErrDescription] = useState("");
  const { inputs, handleSubmit, handleInputChange } = useLoginForm(logUser);

  /**
   * Form validator. Returns true if email is > 0 and password > 8
   *
   * @return {Boolean}
   */
  const validateForm = () => {
    return (
      inputs.email &&
      inputs.email.length > 0 &&
      inputs.password &&
      inputs.password.length >= COSTANTS.MIN_PASSWORD_LENGTH
    );
  };

  /**
   * Submit handler. Signs in user with email and password
   * @param {Object} e Event Object
   */
  async function logUser() {
    setIsLoading(true);
    try {
      await Auth.signIn(inputs.email, inputs.password);
      props.userHasAuthenticated(true);
    } catch (err) {
      alert(err);
      setIsLoading(false);
      setErrDescription(err.message);
    }
  }

  // Form Render
  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <FormGroup controlId="email">
        <Label>Email</Label>
        <FormControl
          type="email"
          key="email"
          autoComplete="off"
          placeholder="Enter email"
          value={inputs.email || ""}
          onChange={handleInputChange}
        />
      </FormGroup>
      <FormGroup controlId="password">
        <Label>Password</Label>
        <FormControl
          type="password"
          key="password"
          autoComplete="off"
          placeholder="Enter password"
          value={inputs.password || ""}
          onChange={handleInputChange}
        />
      </FormGroup>
      <LoaderButton
        block
        disabled={!validateForm()}
        type="submit"
        isLoading={isLoading}
        text="Login"
        loadingText="Logging in..."
      />
    </form>
  );

  return (
    <AuthContainer>
      {errDescription ? (
        <Redirect
          to={{
            pathname: "/err",
            state: {
              errDescription: errDescription
            }
          }}
        />
      ) : (
        renderForm()
      )}
    </AuthContainer>
  );
};

export default Login;
