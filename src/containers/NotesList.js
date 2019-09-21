import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import Table from "./Table";
import CreateTable from "./CreateTable";
import { updateTable } from "../API/tablesAPI";
import { updateNoteTable } from "../API/notesAPI";
import { getNotesByTable, reorderNotes } from "../utils/notesUtils";
import { getTableName } from "../utils/tablesUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const TablesContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const CreateContainer = styled.div`
  display: inline-block;
  width: 50%;
  padding: 20px;
`;
const DragDropContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
`;

const reorder = (list, table, startIndex, endIndex) => {
  const result = Array.from(list[table]);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 *
 * @param {Array} source Source notes Array
 * @param {Array} destination Destination notes Array
 * @param {Object} droppableSource React-beautiful-dnd onDragEnd result.source
 * @param {Object} droppableDestination React-beautiful-dnd onDragEnd result.destination
 *
 * @return {Object} Object containing the ordered notes and the note to be updated
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destinationClone = destination ? Array.from(destination) : [];
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  removed.noteTable = droppableDestination.droppableId;

  destinationClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destinationClone;
  result["noteToUpdate"] = removed;

  return result;
};

class NotesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: this.props.notes,
      tables: this.props.tables,
      isLoading: false,
      preview: false
    };
  }

  // Reorder notes by index
  componentDidMount() {
    const orderedNotes = reorderNotes(this.state.notes, this.state.tables);
    this.setState({ notes: orderedNotes });
  }

  /**
   * Adds a table to the state tables on plus click
   * @param {Object} table Table Object
   */
  addTable = table => {
    const tables = this.state.tables;
    tables.push(table);
    this.setState(tables);
  };

  /**
   * Updates table notes array and indexes
   * @param {string} tableId ID of the table
   * @param {Array} notes Notes to be updated
   *
   * @return {Promise} Promise response
   */
  updateNotesIndexes = async (tableId, notes) => {
    const newNotes = [];
    const tableName = getTableName(this.state.tables, tableId);
    notes.forEach((note, index) => {
      const noteObj = { noteId: note.noteId, noteIndex: index };
      newNotes.push(noteObj);
    });

    return await updateTable(tableId, tableName, newNotes);
  };

  /**
   * Removes a table from state tables
   * @param {string} tableId ID of the table
   */
  removeTable = tableId => {
    const newTables = this.state.tables.filter(table => {
      return table.tableId !== tableId;
    });

    this.setState({ tables: newTables });
  };

  /**
   * Function fired on drag end
   * @param {Object} result Result object
   */
  onDragEnd = async result => {
    const { source, destination } = result;
    const { notes } = this.state;
    const sourceTableId = source.droppableId;
    const destinationTableId = destination.droppableId;

    const destinationNotesLength = notes[destinationTableId]
      ? notes[destinationTableId].length
      : 1;

    console.log(source);
    console.log(destination);
    //Dropped out of the list or swap with Preview
    if (
      !destination ||
      (destination.index === destinationNotesLength &&
        sourceTableId === destinationTableId)
    ) {
      return;
    }

    //If the swap occurs on the same table
    if (
      sourceTableId === destinationTableId &&
      source.index !== destination.index
    ) {
      const orderedNotes = reorder(
        this.state.notes,
        sourceTableId,
        source.index,
        destination.index
      );
      notes[source.droppableId] = orderedNotes;

      this.setState({ notes });

      await this.updateNotesIndexes(sourceTableId, orderedNotes);
    } else if (sourceTableId !== destinationTableId) {
      //If a note is moved from a table to another
      const orderedNotes = move(
        getNotesByTable(this.state.notes, sourceTableId),
        getNotesByTable(this.state.notes, destinationTableId),
        source,
        destination
      );
      notes[sourceTableId] = orderedNotes[sourceTableId];
      notes[destinationTableId] = orderedNotes[destinationTableId];

      this.setState({ notes });

      await this.updateNotesIndexes(sourceTableId, notes[sourceTableId]);
      await this.updateNotesIndexes(
        destinationTableId,
        notes[destinationTableId]
      );

      await updateNoteTable(orderedNotes["noteToUpdate"]);
    }
  };

  render() {
    return !this.props.isLoading ? (
      <DragDropContainer>
        {this.state.notes ? (
          <DragDropContext onDragEnd={this.onDragEnd}>
            <TablesContainer>
              {this.state.tables.map(table => (
                <Table
                  tableName={table.tableName}
                  tableId={table.tableId}
                  notes={getNotesByTable(this.state.notes, table.tableId)}
                  key={table.tableId}
                  removeTable={this.removeTable}
                />
              ))}
              <CreateContainer>
                <CreateTable addTable={this.addTable} />
              </CreateContainer>
            </TablesContainer>
          </DragDropContext>
        ) : null}
      </DragDropContainer>
    ) : (
      <FontAwesomeIcon icon={faSpinner} size="5x" spin />
    );
  }
}

export default NotesList;
