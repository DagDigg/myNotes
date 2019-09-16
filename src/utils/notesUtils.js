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
