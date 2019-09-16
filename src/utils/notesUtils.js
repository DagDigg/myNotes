/**
 * Gets the notes corrisponding to the table
 * @param {Object} notes Total notes
 * @param {string} table The table from which the notes should be extracted
 * @return {Array} A list of extracted notes
 */
export const getNotesByTable = (notes, table) => {
  const extractedNotes = notes[table];
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
