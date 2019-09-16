import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import config from "../config";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import { getTable, updateTable } from "../API/tablesAPI";

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
      noteTable: null
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL = null;
      const note = await this.getNote();

      const { content, attachment, noteIndex, noteTable } = note;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      this.setState({ note, content, attachmentURL, noteIndex, noteTable });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

  async deleteNote() {
    return API.del("notes", `/notes/${this.props.match.params.id}`);
  }

  async removeAttachment(attachment) {
    return Storage.vault.remove(attachment);
  }

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

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFileName(str) {
    return str.replace(/^w+-/, "");
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

      await this.saveNote({
        content: this.state.content,
        attachment: attachment || this.state.note.attachment,
        noteTable: this.state.noteTable
      });

      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

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
      await this.deleteNote();
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
            <FormGroup controlId="content">
              <FormControl
                type="textarea"
                value={this.state.content}
                onChange={this.handleChange}
              />
            </FormGroup>

            {this.state.note.attachment && (
              <FormGroup>
                <FormLabel>Attachment:</FormLabel>
                <div>
                  <a
                    href={this.state.attachmentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.formatFileName(this.state.note.attachment)}
                  </a>
                </div>
              </FormGroup>
            )}

            <FormGroup controlId="file">
              {!this.state.note.attachment && (
                <FormLabel>Attachment:</FormLabel>
              )}
              <FormControl type="file" onChange={this.handleFileChange} />
            </FormGroup>

            <LoaderButton
              block
              text="Save"
              loadingText="Saving..."
              type="submit"
              isLoading={this.state.isLoading}
              disabled={!this.validateForm()}
            />
            <LoaderButton
              block
              text="Delete"
              loadingText="Deleting..."
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
            />
          </form>
        )}
      </div>
    );
  }
}
