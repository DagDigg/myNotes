import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import styled from "styled-components";

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

const TablesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

//Moves from one list to another
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destinationClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destinationClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destinationClone;

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour and scale if dragging
  background: isDragging ? "lightblue" : "#efefe1",
  transform: `scale(${isDragging ? 1.025 : 1})`,

  // styles we need to apply on draggables
  ...draggableStyle
});

class NotesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: this.props.notes,
      tables: [],
      test: [
        { content: "test", noteId: "abcdef" },
        { content: "test2", noteId: "abcdef" }
      ]
    };
  }

  componentDidMount() {
    const tables = this.getTables();
    const notes = this.state.notes.sort((firstNote, secondNote) => {
      return firstNote.noteIndex - secondNote.noteIndex;
    });
    this.setState({ notes, tables });
  }

  getTables() {
    const tables = [];
    this.state.notes.forEach(note => {
      if (!tables.includes(note.noteTable)) {
        tables.push(note.noteTable);
      }
    });
    return tables;
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
    <NoteContainerLink
      to={`/notes/${note.noteId}`}
      style={getItemStyle(isDragging, draggableProps)}
    >
      <NoteCard>{note.content}</NoteCard>
    </NoteContainerLink>
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
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <TablesContainer>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ backgroundColor: "white" }}
              >
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
                        {this.renderNote(note, snapshot.isDragging)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="droppable2">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ backgroundColor: "white" }}
              >
                {this.state.test.map((e, index) => (
                  <Draggable key={e} draggableId={e} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {this.renderNote(e, snapshot.isDragging)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </TablesContainer>
      </DragDropContext>
    );
  }
}

export default NotesList;
