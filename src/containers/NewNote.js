import React, { Component } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";

export default class NewNote extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: false,
      content: ""
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
    this.file = e.target.file[0];
  };

  handleSubmit = async e => {
    e.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    this.setState({ isLoading: true });
  };

  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controllId="content">
            <FormControl
              autoFocus
              type="textarea"
              value={this.state.content}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="file">
            <FormLabel>Attachment:</FormLabel>
            <FormControl type="file" onChange={this.handleFileChange} />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            text="Create note"
            isLoading={!this.validateForm}
            loadingText="Creating note..."
          />
        </form>
      </div>
    );
  }
}
