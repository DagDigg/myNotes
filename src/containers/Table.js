import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { deleteTable } from "../API/tablesAPI";
import { deleteNote } from "../API/notesAPI";
import styled from "styled-components";

const Table = ({ tableName, tableId, notes, removeTable }) => {
  const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  `;

  const NoteContainerLink = styled(LinkContainer)`
    user-select: none;
    padding: 0;
    margin: 0;
    width: 100%;
    transition: transform 0.2s linear;
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

  const NoteCard = styled.div`
    background-color: ${props => props.theme.colors.noteColor};
    width: 100%;
    height: 60px;
    margin-bottom: 20px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const TableContainer = styled.div`
    display: inline-block;
    background-color: ${props => props.theme.colors.cardBackground};
    box-shadow: ${props => props.theme.colors.shadowColor};
    min-width: 270px;
    min-height: 220px;
    max-width: 50%;
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

  const asyncForEach = async (array, callback) => {
    if (!array) {
      return;
    }
    for (let i = 0; i < array.length; i++) {
      await callback(array[i], i, array);
    }
  };

  const handleDelete = async (tableId, notes) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    await deleteTable(tableId);
    asyncForEach(notes, async note => {
      await deleteNote(note.noteId);
    });
    removeTable(tableId);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // change background colour and scale if dragging
    //background: isDragging ? "#FFD16B" : "#fff0d6",
    transform: `scale(${isDragging ? 1.1 : 1})`
  });

  const renderNote = (note, isDragging) => (
    <NoteContainerLink
      to={`/notes/${note.noteId}`}
      style={getItemStyle(isDragging)}
    >
      <NoteCard>{note.content}</NoteCard>
    </NoteContainerLink>
  );

  return (
    <>
      <Droppable droppableId={tableId} key={tableName}>
        {(provided, snapshot) => (
          <TableContainer {...provided.droppableProps} ref={provided.innerRef}>
            <HeaderContainer>
              <h4>{tableName}</h4>
              <DeleteButton onClick={() => handleDelete(tableId, notes)}>
                <FontAwesomeIcon
                  icon={faTimes}
                  size="sm"
                  style={{ display: "inline-block", width: "100%" }}
                />
              </DeleteButton>
            </HeaderContainer>

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
                        {renderNote(note, snapshot.isDragging)}
                      </div>
                    )}
                  </Draggable>
                );
              })}
            {provided.placeholder}
          </TableContainer>
        )}
      </Droppable>
    </>
  );
};

export default Table;
