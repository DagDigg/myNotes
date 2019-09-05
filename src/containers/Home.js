import React, { Component } from "react";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import NotesList from "./NotesList";

import "../Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    try {
      const notes = await this.getNotes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  getNotes() {
    return API.get("notes", "/notes");
  }

  renderLanding() {
    return (
      <div className="lander">
        <h1>myNotes</h1>
        <p>Simple notes taking app.</p>
      </div>
    );
  }

  noteHeader(content) {
    return content.length > 70 ? content.substring(0, 84) + " ..." : content;
  }

  renderNotesList(notes) {
    return <NotesList notes={notes} />;
  }

  renderNotes() {
    return (
      <div className="notes">
        <h1>Notes:</h1>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              {" "}
              <b>{"\uFF0B"}</b> Create note
            </h4>
          </ListGroupItem>
        </LinkContainer>
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLanding()}
      </div>
    );
  }
}
