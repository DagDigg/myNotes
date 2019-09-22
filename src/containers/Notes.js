import React, { Component } from "react";
import { Storage } from "aws-amplify";
import config from "../config";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import { getTable, updateTable } from "../API/tablesAPI";
import { deleteNote, saveNote, getNote } from "../API/notesAPI";
import styled from "styled-components";
import {
  Group,
  Label,
  InputText,
  InputFile,
  LabelFile,
  FileText
} from "../components/StyledNote";

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: false,
      isDeleting: false,
      note: null,
      content: "",
      attachmentURL: null,
      noteIndex: null,
      noteTable: null,
      fileName: ""
    };
  }

  // Destructuring note Object and setting state
  async componentDidMount() {
    try {
      let attachmentURL = null;
      const note = await getNote(this.props.match.params.id);

      const { content, attachment, noteIndex, noteTable } = note;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({
        note,
        content,
        attachmentURL,
        noteIndex,
        noteTable
      });
    } catch (e) {
      alert(e);
    }
  }

  /**
   * Removes attachment from s3
   * @param {string} attachment Attachment to remove
   */
  async removeAttachment(attachment) {
    return Storage.vault.remove(attachment);
  }

  // Removes note from table and updates it. Called on handleDelete
  async removeNoteFromTable() {
    const noteId = this.state.note.noteId;
    const tableId = this.state.note.noteTable;
    const table = await getTable(tableId);
    const tableName = table.tableName;
    const newTableNotes = table.notes.filter(note => {
      return note.noteId !== noteId;
    });

    return await updateTable(tableId, tableName, newTableNotes);
  }

  // Form validation
  validateForm() {
    return this.state.content.length > 0;
  }

  // RegEx to format file name
  formatFileName(str) {
    return str.replace(/^w+-/, "");
  }

  /**
   * Handler for inputs. Sets the corrisponding id state to value
   * @param {Object} e Event Object
   */
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  /**
   * Handler for file change. Sets file and fileName
   * @param {Object} e Event Object
   */
  handleFileChange = e => {
    this.file = e.target.files[0];
    const fileName = e.target.files[0].name;
    this.setState({ fileName });
  };

  /**
   * Submit form handler. Saves the note and updates attachment if a new one is provided
   * @param {Object} e Event Object
   */
  handleSubmit = async e => {
    e.preventDefault();
    let attachment;

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than 
        ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
      );
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
        const { attachment: oldAttachment } = this.state.note;
        await this.removeAttachment(oldAttachment);
      }

      const body = {
        content: this.state.content,
        attachment: attachment || this.state.note.attachment,
        noteTable: this.state.noteTable
      };

      await saveNote(body, this.props.match.params.id);

      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  /**
   * Handler for delete button. Removes attachment if present, note and note from table
   * @param {Object} e Event Object
   */
  handleDelete = async e => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      if (this.state.note.attachment) {
        await this.removeAttachment(this.state.note.attachment);
      }
      await this.removeNoteFromTable();
      await deleteNote(this.props.match.params.id);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }

    this.setState({ isDeleting: true });
  };

  render() {
    return (
      <div className="Notes">
        {this.state.note && (
          <form onSubmit={this.handleSubmit}>
            <Group id="content">
              <Label>Edit note</Label>
              <InputText
                id="content"
                value={this.state.content}
                onChange={this.handleChange}
              />
            </Group>

            {this.state.note.attachment && (
              <Group>
                <Label>Attachment:</Label>
                <div style={{ textAlign: "left" }}>
                  <a
                    href={this.state.attachmentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.formatFileName(this.state.note.attachment)}
                  </a>
                </div>
              </Group>
            )}

            <Group id="file">
              {!this.state.note.attachment && <Label>Attachment:</Label>}
              <InputFile
                type="file"
                name="file-select"
                id="file-select"
                onChange={this.handleFileChange}
              />
              <LabelFile htmlFor="file-select">Choose a file</LabelFile>
              {this.state.fileName && (
                <FileText>{this.state.fileName}</FileText>
              )}
            </Group>

            <ButtonsContainer>
              <LoaderButton
                block
                text="Save"
                loadingText="Saving..."
                type="submit"
                colorType="#20d420"
                isLoading={this.state.isLoading}
                disabled={!this.validateForm()}
              />
              <LoaderButton
                block
                text="Delete"
                loadingText="Deleting..."
                colorType="red"
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
              />
            </ButtonsContainer>
          </form>
        )}
      </div>
    );
  }
}
