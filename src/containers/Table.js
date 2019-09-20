import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { deleteTable } from "../API/tablesAPI";
import { deleteNote } from "../API/notesAPI";
import styled from "styled-components";
import Title from "./Title";

const Table = ({ tableName, tableId, notes, removeTable }) => {
  const [title, setTitle] = useState(tableName);

  const TableContainer = styled.div`
    display: inline-block;
    background-color: ${props => props.theme.colors.cardBackground};
    box-shadow: 0px 0px 5px -1px ${props => props.theme.colors.shadowColor};
    width: 400px;
    min-height: 270px;
    flex-grow: 1;
    border-radius: 10px;
    margin: 10px;
    padding: 20px;
    & h4 {
      padding: 0;
      margin: 0;
      text-align: left;
      color: ${props => props.theme.colors.primaryText};
    }
  `;

  const NotesContainer = styled.div`
    min-height: 70%;
    width: 100%;
  `;

  const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  `;

  const NoteContainer = styled.div`
    height: auto;
    padding: 15px 0;
  `;

  const NoteLink = styled(LinkContainer)`
    padding: 0;
    margin: 0;
    width: 100%;
    transition: transform 0.3s ease-in-out;
  `;

  const NoteCard = styled.div`
    background-color: ${props => props.theme.colors.noteColor};
    position: relative;
    text-align: center;
    width: 100%;
    height: 60px;
    border-radius: 15px;
    border: 1px solid transparent;
    transition: border 0.1s ease-in-out;
    &:hover {
      border: 1px solid ${props => props.theme.colors.secondaryText};
    }
  `;

  const DeleteButton = styled.div`
    width: 25px;
    height: 25px;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.colors.secondaryText};
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    text-align: center;
    vertical-align: middle;
    &:hover {
      background-color: red;
      color: white;
    }
    & span {
      font-size: 14px;
      font-weight: bold;
      display: inline-block;
      width: 100%;
    }
  `;

  const TextContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 50px;
  `;

  const NoteText = styled.p`
    font-size: 18px;
    display: block;
    margin: 0;
  `;

  const NoteDate = styled.span`
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    right: 10px;
  `;

  /**
   * Updates table title
   * @param {string} newTitle New table title
   */
  const updateTitle = newTitle => {
    setTitle(newTitle);
  };

  /**
   * Helper forEach with async/await
   * @param {Array} array Array to be iterated
   * @param {Function} callback Callback async function
   */
  const asyncForEach = async (array, callback) => {
    if (!array) {
      return;
    }
    for (let i = 0; i < array.length; i++) {
      await callback(array[i], i, array);
    }
  };

  /**
   * Deletes a table and its corresponding notes
   * @param {string} tableId ID of the table
   * @param {Array} notes Notes Object of the table to be deleted
   */
  const handleDelete = async (tableId, notes) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this table?"
    );

    if (!confirmed) {
      return;
    }
    console.log(tableId);
    await deleteTable(tableId);
    asyncForEach(notes, async note => {
      await deleteNote(note.noteId);
    });
    removeTable(tableId);
  };

  /**
   * Changes style to dragging note
   * @param {Boolean} isDragging Boolean value
   */
  const getItemStyle = isDragging => ({
    //transform: `scale(${isDragging ? 1.1 : 1})`
    boxShadow: isDragging ? "0px 0px 5px -1px #0a0a0a" : "none"
  });

  /**
   * Trims the note content to be displayed if too long
   * @param {string} text Note content
   */
  const formatText = text => {
    if (text.length > 40) {
      return text.substring(0, 40);
    } else {
      return text;
    }
  };

  /**
   * Note Card render function
   * @param {Object} note Note Object
   * @param {Boolean} isDragging Boolean value
   */
  const renderNote = (note, isDragging) => (
    <NoteContainer>
      <NoteLink to={`/notes/${note.noteId}`} style={getItemStyle(isDragging)}>
        <NoteCard>
          <TextContainer>
            <NoteText>{formatText(note.content)}</NoteText>
          </TextContainer>

          <NoteDate>{new Date(note.createdAt).toLocaleString()}</NoteDate>
        </NoteCard>
      </NoteLink>
    </NoteContainer>
  );

  return (
    <>
      <TableContainer key={tableId}>
        <HeaderContainer>
          <Title
            value={title}
            updateTitle={updateTitle}
            tableId={tableId}
            notes={notes}
          ></Title>

          <DeleteButton onClick={() => handleDelete(tableId, notes)}>
            <FontAwesomeIcon
              icon={faTimes}
              size="sm"
              style={{ display: "inline-block", width: "100%" }}
            />
          </DeleteButton>
        </HeaderContainer>
        <Droppable droppableId={tableId} key={tableId}>
          {(provided, snapshot) => (
            <NotesContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {notes &&
                notes.map((note, index) => {
                  return (
                    <Draggable
                      key={note.noteId}
                      draggableId={note.noteId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderNote(
                            note,
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </NotesContainer>
          )}
        </Droppable>
      </TableContainer>
    </>
  );
};

export default Table;
