import React, { Component } from "react";
import styled from "styled-components";
import { updateTable } from "../API/tablesAPI";

const Header = styled.textarea`
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 32px;
  padding-left: 5px;
  color: ${props => props.theme.colors.secondaryText};
  background-color: transparent;
  resize: none;
  border: 1px solid transparent;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    border: 1px solid ${props => props.theme.colors.noteColor};
    background-color: ${props => props.theme.colors.appBackground};
  }
`;

class Title extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.value,
      newTitle: this.props.value
    };
  }

  /**
   * Validates table title. Returns true if length > 0 and if it's different from the previous
   *
   * @return {Boolean} Boolean value
   */
  validateTableTitle() {
    return (
      this.state.newTitle.length > 0 && this.state.newTitle !== this.state.title
    );
  }

  // Resets the title to the old one
  resetTitle() {
    this.setState({ newTitle: this.state.title });
  }

  // Save title on click outside
  handleBlur = async () => {
    await this.saveTitle();
  };

  /**
   * Sets the state with new title
   * @param {Object} e Event Object
   */
  onTitleChange = e => {
    e.preventDefault();
    const newTitle = e.target.value;
    this.setState({ newTitle });
  };

  /**
   * Saves the title on enter pressed
   * @param {Object} e Event Object
   */
  onEnterPress = async e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      await this.saveTitle();
    }
  };

  // Saves the title and updates table
  saveTitle = async () => {
    if (!this.state.newTitle.length) {
      this.resetTitle();
      return;
    } else if (this.validateTableTitle()) {
      const { tableId, notes } = this.props;
      const newTitle = this.state.newTitle;

      this.setState({ title: newTitle });
      this.props.updateTitle(newTitle);
      await updateTable(tableId, newTitle, notes);
    }
  };

  render() {
    return (
      <Header
        value={this.state.newTitle}
        onChange={this.onTitleChange}
        onKeyDown={this.onEnterPress}
        onBlur={this.handleBlur}
        rows="1"
      ></Header>
    );
  }
}

export default Title;
