import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { LinkContainer } from "react-router-bootstrap";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { API } from "aws-amplify";
import styled from "styled-components";

const NoteContainer = styled(LinkContainer)`
  user-select: none;
  padding: 16px;
  margin: 10px;
  transition: transform 0.2s linear;
`;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour and scale if dragging
  background: isDragging ? "lightblue" : "white",
  transform: `scale(${isDragging ? 1.025 : 1})`,

  // styles we need to apply on draggables
  ...draggableStyle
});

class NotesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: this.props.notes
    };
  }

  componentDidMount() {
    const notes = this.state.notes.sort((firstNote, secondNote) => {
      return firstNote.noteIndex - secondNote.noteIndex;
    });
    this.setState({ notes });
  }

  swapNotes = async (sourceIdx, destinationIdx) => {
    const firstNote = this.state.notes[sourceIdx];
    const firstNoteIdx = firstNote.noteIndex;
    const secondNote = this.state.notes[destinationIdx];
    const secondNoteIdx = secondNote.noteIndex;

    firstNote.noteIndex = secondNoteIdx;
    secondNote.noteIndex = firstNoteIdx;
    if (sourceIdx !== destinationIdx) {
      await API.put("notes", `/notes/${secondNote.noteId}`, {
        body: secondNote
      });

      await API.put("notes", `/notes/${firstNote.noteId}`, {
        body: firstNote
      });
    }
  };

  renderNote = (note, isDragging, draggableProps) => (
    <NoteContainer
      to={`/notes/${note.noteId}`}
      style={getItemStyle(isDragging, draggableProps)}
    >
      <ListGroupItem style={{ backgroundColor: "#EFEFE1" }}>
        {note.content}
      </ListGroupItem>
    </NoteContainer>
  );

  onDragEnd = async result => {
    //Dropped out of the list
    if (!result.destination) {
      return;
    }

    const notes = reorder(
      this.state.notes,
      result.source.index,
      result.destination.index
    );

    this.setState({ notes });

    await this.swapNotes(result.source.index, result.destination.index);
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {this.state.notes.map((note, index) => (
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
                      <ListGroup>
                        {this.renderNote(note, snapshot.isDragging)}
                      </ListGroup>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default NotesList;
