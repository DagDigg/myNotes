import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { LinkContainer } from "react-router-bootstrap";
import styled from "styled-components";

const Table = ({ tableName, notes }) => {
  const NoteContainerLink = styled(LinkContainer)`
    user-select: none;
    padding: 16px;
    margin: 10px;
    transition: transform 0.2s linear;
  `;

  const NoteCard = styled.div`
    background-color: #efefe1;
    width: 250px;
    border-radius: 5px;
    border: 1px solid #444b6e;
  `;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // change background colour and scale if dragging
    background: isDragging ? "lightblue" : "#efefe1",
    transform: `scale(${isDragging ? 1.025 : 1})`,

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const renderNote = (note, isDragging, draggableProps) => (
    <NoteContainerLink
      to={`/notes/${note.noteId}`}
      style={getItemStyle(isDragging, draggableProps)}
    >
      <NoteCard>{note.content}</NoteCard>
    </NoteContainerLink>
  );

  return (
    <Droppable droppableId={tableName}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{ backgroundColor: "white" }}
        >
          {notes.map((note, index) => {
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
        </div>
      )}
    </Droppable>
  );
};

export default Table;
