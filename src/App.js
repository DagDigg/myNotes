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
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
`;

const AppContainer = styled.div`
  text-align: center;
  overflow: hidden;
  min-height: 95vh;
  background-color: ${props => props.theme.colors.appBackground};
  box-shadow: 0px 0px 5px -1px ${props => props.theme.colors.shadowColor};
  display: block;
  border-radius: 5px;
  flex: flex-grow;
  width: 75vw;
  margin: 20px;
  flex-basis: 1;
  padding: 20px;
`;

const Logo = styled.span`
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  text-decoration: none;
  color: ${props => props.theme.colors.primaryText};
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  margin: 0 20px;
  width: 60px;
  height: 34px;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.buttonColor};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
  &::before {
    border-radius: 50%;
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:focus + ${Slider} {
    box-shadow: 0 0 1px #2196f3;
  }

  &:checked + ${Slider}::before {
    transform: translateX(26px);
  }
`;

const AuthenticationBtn = styled.span`
  text-decoration: none;
  color: ${props => props.theme.colors.secondaryText};
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      darkMode: false
    };
  }

  // Load current session
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

  /**
   * Sets the state if authenticated or not
   * @param {Boolean} authenticated Boolean value of authenticated
   */
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  // Logout handler
  handleLogout = async () => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/myNotes/login");
  };

  // Toggle for light/dark mode
  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode });
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating && (
        <ThemeProvider theme={this.state.darkMode ? darkTheme : lightTheme}>
          <Container>
            <AppContainer>
              <Navbar fluid="true" collapseOnSelect className="nav">
                <Navbar.Brand>
                  <Link to="/" className="logo">
                    <Logo>myNotes</Logo>
                  </Link>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                  <Switch>
                    <CheckBox type="checkbox" onClick={this.toggleDarkMode} />
                    <Slider />
                  </Switch>
                  <Nav>
                    {this.state.isAuthenticated ? (
                      <Nav.Link onClick={this.handleLogout}>
                        <AuthenticationBtn>Logout</AuthenticationBtn>
                      </Nav.Link>
                    ) : (
                      <Fragment>
                        <LinkContainer to="/login">
                          <Nav.Link>
                            <AuthenticationBtn>Login</AuthenticationBtn>
                          </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/signup">
                          <Nav.Link>
                            <AuthenticationBtn>Sign up</AuthenticationBtn>
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
