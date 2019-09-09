import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  background-color: #fed99b;
  height: 95vh;
  border-radius: 5px;
  flex: flex-grow;
  width: 75vw;
  margin: 0;
  flex-basis: 1;
  padding: 20px;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }
  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  handleLogout = async () => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating && (
        <Container>
          <Navbar fluid="true" collapseOnSelect className="nav">
            <Navbar.Brand>
              <Link to="/" className="logo">
                myNotes
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                {this.state.isAuthenticated ? (
                  <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
                ) : (
                  <Fragment>
                    <LinkContainer to="/login">
                      <Nav.Link>
                        <span style={{ outline: "none" }}>Login</span>
                      </Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/signup">
                      <Nav.Link style={{ outline: "none" }}>Sign Up</Nav.Link>
                    </LinkContainer>
                  </Fragment>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </Container>
      )
    );
  }
}

export default withRouter(App);
