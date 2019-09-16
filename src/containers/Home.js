import React, { Component } from "react";
import { API } from "aws-amplify";
import { listTables } from "../API/tablesAPI";
import { getNotes } from "../API/notesAPI";
import { LinkContainer } from "react-router-bootstrap";
import NotesList from "./NotesList";
import styled from "styled-components";

import "../Home.css";

const CreateNote = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #ffd16b;
  border: 1px solid #ff9f1c;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
  cursor: pointer;

  & > span {
    font-size: 44px;
    font-weight: bolder;
    color: #555555;
    transition: color 0.3s;
  }
  &:hover {
    background-color: #ff9f1c;
  }
  & > span:hover {
    color: white;
  }
`;

const NotesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px 16px;
`;

const NoteContainer = styled.div`
  width: 100%;
`;

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: {},
      tables: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    try {
      const rawNotes = await getNotes();
      const tables = await listTables();
      const tableIds = this.getTableIds(tables);
      const notes = this.getGroupedNotes(tableIds, rawNotes);
      this.setState({ notes, tables });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  //Creates notes Object grouped by tableId
  getGroupedNotes(tables, notes) {
    if (!notes.length) {
      return null;
    }
    const groupedNotes = {};
    tables.forEach(table => {
      groupedNotes[table] = [];
      notes.forEach(note => {
        if (note.noteTable === table) {
          groupedNotes[table].push(note);
        }
      });
    });

    return groupedNotes;
  }

  //Gets tableId from  tables Object
  getTableIds(tables) {
    const tableIds = [];
    tables.forEach(table => {
      tableIds.push(table.tableId);
    });

    return tableIds;
  }

  //Renders landing page
  renderLanding() {
    return (
      <div className="lander">
        <h4>myNotes</h4>
        <p>Simple notes taking app.</p>
      </div>
    );
  }

  //Trims note text if it's too long
  noteHeader(content) {
    return content.length > 70 ? content.substring(0, 84) + " ..." : content;
  }

  //Renders NotesList.js Component. Called inside renderNotes()
  renderNotesList(notes, tables) {
    return <NotesList notes={notes} tables={tables} />;
  }

  //Renders NotesList component and NewNote component
  renderNotes() {
    return (
      <div className="notes">
        <NotesHeader>
          <h1 style={{ marginBottom: "0px", lineHeight: "70px" }}>Notes</h1>

          <LinkContainer
            to={{
              pathname: "/notes/new",
              props: {
                tables: this.state.tables
              }
            }}
          >
            <CreateNote>
              <span>{"\uFF0B"}</span>
            </CreateNote>
          </LinkContainer>
        </NotesHeader>

        <NoteContainer>
          {!this.state.isLoading &&
            this.renderNotesList(this.state.notes, this.state.tables)}
        </NoteContainer>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLanding()}
      </div>
    );
  }
}
