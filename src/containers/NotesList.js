import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { API } from "aws-amplify";
import styled from "styled-components";
import Table from "./Table";
import { listTables, updateTable } from "../API/tablesAPI";

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
      tables: this.props.tables,
      render: false
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

  updateNotesIndexes = async (tableId, notes) => {
    const newNotes = [];
    const tableName = this.getNotesByTable(tableId);
    notes.forEach((note, index) => {
      const noteObj = { noteId: note.noteId, noteIndex: index };
      newNotes.push(noteObj);
    });

    return await updateTable(tableId, tableName, newNotes);
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
        source.droppableId,
        source.index,
        destination.index
      );
      notes[source.droppableId] = orderedNotes;
      this.setState({ notes });
      await this.updateNotesIndexes(source.droppableId, orderedNotes);
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
        {this.state.notes ? (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <TablesContainer>
              {this.state.tables.map(table => (
                <Table
                  tableName={table.tableName}
                  tableId={table.tableId}
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
