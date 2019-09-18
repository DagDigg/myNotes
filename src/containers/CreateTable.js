import React from "react";
import styled from "styled-components";
import { createTable } from "../API/tablesAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const CreateTable = ({ addTable }) => {
  const NewTableBtn = styled.div`
    width: 75px;
    height: 75px;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid ${props => props.theme.colors.buttonColor};
    color: ${props => props.theme.colors.buttonColor};
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    display: inline-block;
    vertical-align: middle;
    margin: 20%;
    & span {
      font-size: 48px;
      font-weight: bolder;
      text-align: center;
    }

    &:hover {
      background-color: ${props => props.theme.colors.buttonColor};
      color: white;
    }
  `;

  const handleClick = async e => {
    e.preventDefault();
    const table = await createTable("Table");
    addTable(table);
  };
  return (
    <NewTableBtn onClick={handleClick}>
      <span>
        <FontAwesomeIcon icon={faPlus} />
      </span>
    </NewTableBtn>
  );
};

export default CreateTable;
