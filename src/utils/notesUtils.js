/**
 * Gets the notes corrisponding to the table
 * @param {Object} notes Total notes
 * @param {string} table The table ID from which the notes should be extracted
 * @return {Array} A list of extracted notes
 */
export const getNotesByTable = (notes, tableId) => {
  const extractedNotes = notes[tableId];
  return extractedNotes;
};

/**
 * Creates notes Object grouped by tableId
 * @param {Array} tables
 * @param {Array} notes
 * @return {Object} Notes grouped by tableId
 */
export const getGroupedNotes = (tables, notes) => {
  if (!notes.length) {
    return null;
  }
  const groupedNotes = {};
  tables.forEach(table => {
    groupedNotes[table] = [];
    notes.forEach(note => {
      if (note.noteTable === table) {
        groupedNotes[table].push(note);
      }
    });
  });

  return groupedNotes;
};

export const reorderNotes = (notes, tables) => {
  const orderedNotes = {};

  tables.forEach(table => {
    if (!table.notes) {
      return;
    }
    const tableId = table.tableId;
    orderedNotes[tableId] = [];

    table.notes.forEach(tableNote => {
      const noteId = tableNote.noteId;
      const noteObj = notes[tableId].find(note => {
        return note.noteId === noteId;
      });
      orderedNotes[tableId].push(noteObj);
    });
  });

  return orderedNotes;
};
