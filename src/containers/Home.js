import React, { Component } from "react";
import { listTables } from "../API/tablesAPI";
import { getNotes } from "../API/notesAPI";
import { LinkContainer } from "react-router-bootstrap";
import NotesList from "./NotesList";
import styled from "styled-components";
import { getTableIds } from "../utils/tablesUtils";
import { getGroupedNotes } from "../utils/notesUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import LandingPage from "./LandingPage";

const HomeContainer = styled.div`
  height: 100%;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primaryText};
  margin: 0px;
  line-height: 70px;
`;

const CreateNote = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.colors.buttonColor};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
  cursor: pointer;

  & > span {
    font-size: 32px;
    color: ${props => props.theme.colors.secondaryText};
    transition: color 0.3s;
  }
  &:hover {
    background-color: ${props => props.theme.colors.buttonColor};
  }
  & > span:hover {
    color: white;
  }
`;

const CreateTable = styled.div`
  width: 140px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid ${props => props.theme.colors.buttonColor};
  color: ${props => props.theme.colors.secondaryText};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  margin-left: auto;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.colors.buttonColor};
    color: white;
  }
  & h5 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
`;

const NotesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      //Get notes, tables and tableIDs
      const rawNotes = await getNotes();
      const tables = await listTables();
      const tableIds = getTableIds(tables);
      //Group notes by table
      const notes = getGroupedNotes(tableIds, rawNotes);
      //Set state with grouped notes and total tables
      this.setState({ notes, tables });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  /**
   * Renders NotesList Component. Called inside renderNotes()
   * @param {Object} notes Total notes
   * @param {Object} tables Total tables
   */
  renderNotesList(notes, tables) {
    return (
      <NotesList
        notes={notes}
        tables={tables}
        isLoading={this.state.isLoading}
      />
    );
  }

  //Renders NotesList component and NewNote component
  renderNotes() {
    return (
      <>
        <NotesHeader>
          <Title>Notes</Title>

          {/*Create Table Button*/}
          <LinkContainer
            to={{
              pathname: "/tables/new",
              props: {
                tables: this.state.tables
              }
            }}
          >
            <CreateTable>
              <h5>Create Table</h5>
            </CreateTable>
          </LinkContainer>

          {/*Create Note Button*/}
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

        {/*Notes List*/}
        <NoteContainer>
          {!this.state.isLoading ? (
            this.renderNotesList(this.state.notes, this.state.tables)
          ) : (
            <FontAwesomeIcon icon={faSpinner} size="5x" spin />
          )}
        </NoteContainer>
      </>
    );
  }

  render() {
    return (
      <HomeContainer>
        {this.props.isAuthenticated ? this.renderNotes() : <LandingPage />}
      </HomeContainer>
    );
  }
}
