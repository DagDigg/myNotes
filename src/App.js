import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import lightTheme from "./themes/light";
import darkTheme from "./themes/dark";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
`;

const AppContainer = styled.div`
  text-align: center;
  background-color: ${props => props.theme.colors.appBackground};
  box-shadow: ${props => props.theme.colors.shadowColor}
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
        <ThemeProvider theme={darkTheme}>
          <Container>
            <AppContainer>
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
                          <Nav.Link style={{ outline: "none" }}>
                            Sign Up
                          </Nav.Link>
                        </LinkContainer>
                      </Fragment>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <Routes childProps={childProps} />
            </AppContainer>
          </Container>
        </ThemeProvider>
      )
    );
  }
}

export default withRouter(App);
