/**
 * Gets the tableName property
 * @param {Array} tables Total tables
 * @param {string} id The id to match the desired table
 * @return {string} Name of the table
 */
export const getTableName = (tables, id) => {
  const tableMatched = tables.find(table => {
    return table.tableId === id;
  });
  return tableMatched.tableName;
};

/**
 * Gets the tables IDs from the total tables
 * @param {Array} tables Total tables
 * @return {Array} An array of tables IDs
 */
export const getTableIds = tables => {
  let result = [];
  tables.forEach(table => {
    result.push(table.tableId);
  });
  return result;
};

/**
 * Gets note object for table format
 * @param {string} noteId ID of the note
 * @param {Number} index Index of the note
 *
 * @return {Object} Note Object to be added to the table
 */
export const getTableNoteObj = (noteId, index) => ({
  noteId: noteId,
  noteIndex: index
});
