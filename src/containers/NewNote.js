import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { API } from "aws-amplify";
import config from "../config";
import { s3Upload } from "../libs/awsLib";

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: false,
      content: "",
      noteTable: "droppable"
    };
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
      await this.createNote({
        attachment,
        content: this.state.content,
        noteTable: this.state.noteTable
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  createNote(note) {
    return API.post("notes", "/notes", {
      body: note
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
            <FormControl type="textarea" onChange={this.handleChange} />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            text="Create note"
            disabled={!this.validateForm}
            loadingText="Creating note..."
            isLoading={this.state.isLoading}
          />
        </form>
      </div>
    );
  }
}
