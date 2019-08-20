import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import "./App.css";

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
        <div className="App container">
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
                        <span className="navLink">Login</span>
                      </Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/signup">
                      <Nav.Link className="navLink">Sign Up</Nav.Link>
                    </LinkContainer>
                  </Fragment>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      )
    );
  }
}

export default withRouter(App);
