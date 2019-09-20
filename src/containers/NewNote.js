import React, { Component } from "react";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import { updateTable, listTables } from "../API/tablesAPI";
import { getTableName } from "../utils/tablesUtils";
import styled from "styled-components";
import {
  Group,
  Label,
  InputText,
  InputFile,
  LabelFile,
  FileText
} from "../components/StyledNote";

const Select = styled.select`
  float: left;
  width: 100px;
  height: 40px;
  outline: none;
  border-radius: 10px;
  color: ${props => props.theme.colors.primaryText};
`;

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: false,
      content: "",
      noteTable: "",
      tables: [],
      fileName: ""
    };
  }

  async componentDidMount() {
    //Check if the NewNote page has been clicked or directly accessed
    const tables = await listTables();

    if (!tables.length) {
      window.alert("You must have at least a table before creating a note");
      this.props.history.push("/");
      return;
    }

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
    const fileName = e.target.files[0].name;

    this.setState({ fileName });
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
      return (
        <option value={table.tableId} key={table.tableId}>
          {table.tableName}
        </option>
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Group id="content">
            <Label>Note content</Label>
            <InputText
              id="content"
              autoFocus
              autoComplete="off"
              value={this.state.content}
              onChange={this.handleChange}
            />
          </Group>
          <Group id="file">
            <Label>Attachment:</Label>
            <InputFile
              type="file"
              name="file-select"
              id="file-select"
              onChange={this.handleFileChange}
            />
            <LabelFile htmlFor="file-select">Choose a file</LabelFile>
            {this.state.fileName && (
              <FileText> {this.state.fileName} </FileText>
            )}
          </Group>
          <Group id="noteTable">
            <Label>Table:</Label>
            <Select id="noteTable" onChange={this.handleChange}>
              {this.renderTablesOptions()}
            </Select>
          </Group>
          <Group>
            <LoaderButton
              block
              type="submit"
              text="Create note"
              disabled={!this.validateForm()}
              loadingText="Creating note..."
              isLoading={this.state.isLoading}
            />
          </Group>
        </form>
      </div>
    );
  }
}
