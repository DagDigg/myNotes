import React, { useState } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { createTable } from "../API/tablesAPI";
import styled from "styled-components";

const NewTable = ({ history }) => {
  const Label = styled.span`
    color: ${props => props.theme.colors.secondaryText};
    float: left;
    padding: 16px;
  `;
  const [tableName, setTableName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Form validation
   *
   * @return {Boolean} Boolean value
   */
  const validateForm = () => {
    return tableName.length > 0;
  };

  /**
   * Handler for table name. Sets state with the name
   * @param {Object} e Event Object
   */
  const handleChange = e => {
    setTableName(e.target.value);
  };

  /**
   * Handler for submit form. Creates a table.
   * @param {Object} e Event Object
   */
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createTable(tableName);
      history.push("/");
    } catch (e) {
      setIsLoading(false);
      alert(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label>Choose a table name</Label>
      <FormGroup>
        <FormControl
          autoFocus
          type="textarea"
          onChange={handleChange}
          autoComplete="off"
          value={tableName}
        />
      </FormGroup>
      <LoaderButton
        block
        type="submit"
        text="Create table"
        disabled={!validateForm()}
        loadingText="Creating table..."
        isLoading={isLoading}
      >
        Submit
      </LoaderButton>
    </form>
  );
};

export default NewTable;
