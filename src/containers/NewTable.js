import React, { useState } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { createTable } from "../API/tablesAPI";

const NewTable = ({ history }) => {
  const [tableName, setTableName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validateForm = () => {
    return tableName.length > 0;
  };

  const handleChange = e => {
    setTableName(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createTable(tableName);
      history.push("/");
    } catch (e) {
      alert(e);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormLabel>Choose a table name</FormLabel>
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
