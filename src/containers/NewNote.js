import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import { updateTable, listTables } from "../API/tablesAPI";
import { getTableName } from "../utils/tablesUtils";

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: false,
      content: "",
      noteTable: "ab3617e0-d55b-11e9-a002-29c83487612b",
      tables: []
    };
  }

  async componentDidMount() {
    //Check if the NewNote page has been clicked or directly accessed
    const tables = this.props.location.props
      ? this.props.location.props.tables
      : await listTables();
    //Get first tableId
    const noteTable = tables[0].tableId;
    this.setState({ tables, noteTable });
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleFileChange = e => {
    this.file = e.target.files[0];
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    try {
      const attachment = this.file ? await s3Upload(this.file) : null;
      const uuid = require("uuid/v1");
      const noteId = uuid();

      await this.createNote({
        noteId: noteId,
        attachment,
        content: this.state.content,
        noteTable: this.state.noteTable
      });

      await this.addNoteToTable(noteId);

      this.props.history.push("/");
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false });
    }
  };

  createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }

  addNoteToTable = async noteId => {
    const tableObj = this.state.tables.find(table => {
      return table.tableId === this.state.noteTable;
    });

    const notes = tableObj.notes || [];
    const idx = notes.length;
    const newNote = { noteId: noteId, noteIndex: idx };
    const tableName = getTableName(this.state.tables, this.state.noteTable);
    notes.push(newNote);
    return await updateTable(this.state.noteTable, tableName, notes);
  };

  renderTablesOptions() {
    return this.state.tables.map(table => {
      return <option value={table.tableId}>{table.tableName}</option>;
    });
  }

  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              autoFocus
              autoComplete="off"
              type="textarea"
              value={this.state.content}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="file">
            <FormLabel>Attachment:</FormLabel>
            <FormControl type="file" onChange={this.handleFileChange} />
          </FormGroup>
          <FormGroup controlId="noteTable">
            <FormLabel>Table:</FormLabel>
            <FormControl as="select" onChange={this.handleChange}>
              {this.renderTablesOptions()}
            </FormControl>
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            text="Create note"
            disabled={!this.validateForm()}
            loadingText="Creating note..."
            isLoading={this.state.isLoading}
          />
        </form>
      </div>
    );
  }
}
