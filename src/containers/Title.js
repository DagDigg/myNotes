import React, { Component } from "react";
import styled from "styled-components";
import { updateTable } from "../API/tablesAPI";

const Header = styled.textarea`
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: ${props => props.theme.colors.primaryText};
  background-color: transparent;
  resize: none;
  border: none;
`;

class Title extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.value,
      newTitle: this.props.value
    };
  }

  validateTableTitle() {
    return (
      this.state.newTitle.length > 0 && this.state.newTitle !== this.state.title
    );
  }

  resetTitle() {
    this.setState({ newTitle: this.state.title });
  }

  handleBlur = async () => {
    await this.saveTitle();
  };

  onTitleChange = e => {
    e.preventDefault();
    const newTitle = e.target.value;
    this.setState({ newTitle });
  };

  onEnterPress = async e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      await this.saveTitle();
    }
  };

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
