import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { API } from "aws-amplify";
import styled from "styled-components";
import Table from "./Table";
import { listTables, postInitialTable } from "../API/tablesAPI";

const TablesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const reorder = (list, table, startIndex, endIndex) => {
  const result = Array.from(list[table]);
  console.log(result);
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

class NotesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: this.props.notes,
      tables: this.props.tables
    };
  }

  getNotesByTable(table) {
    const notes = this.state.notes[table];
    return notes;
  }

  getTableIds(tables) {
    let result = [];
    tables.forEach(table => {
      result.push(table.tableId);
    });
    return result;
  }

  swapNotes = async (sourceIdx, destinationIdx, table) => {
    const tableNotes = this.state.notes[table];
    const firstNote = tableNotes[sourceIdx];
    const firstNoteIdx = firstNote.noteIndex;
    const secondNote = tableNotes[destinationIdx];
    const secondNoteIdx = secondNote.noteIndex;

    firstNote.noteIndex = secondNoteIdx;
    secondNote.noteIndex = firstNoteIdx;

    await API.put("notes", `/notes/${secondNote.noteId}`, {
      body: secondNote
    });

    await API.put("notes", `/notes/${firstNote.noteId}`, {
      body: firstNote
    });
  };

  onDragEnd = async result => {
    const { source, destination } = result;
    const { notes } = this.state;
    console.log(result);
    //Dropped out of the list
    if (!result.destination) {
      return;
    }

    //If the swap occurs on the same table
    if (
      source.droppableId === destination.droppableId &&
      source.index !== destination.index
    ) {
      const orderedNotes = reorder(
        this.state.notes,
        source.index,
        destination.index,
        source.droppableId
      );
      notes[source.droppableId] = orderedNotes;
      this.setState({ notes });
      await this.swapNotes(source.index, destination.index, source.droppableId);
    } else {
      const notes = move(
        this.getNotesByTable(source.droppableId),
        this.getNotesByTable(destination.droppableId),
        source,
        destination
      );
    }
  };

  render() {
    return (
      <div>
        {this.state.tables ? (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <TablesContainer>
              {this.state.tables.map(table => (
                <Table
                  tableName={table.tableName}
                  notes={this.getNotesByTable(table.tableId)}
                  key={table.tableId}
                />
              ))}
            </TablesContainer>
          </DragDropContext>
        ) : null}
      </div>
    );
  }
}

export default NotesList;
