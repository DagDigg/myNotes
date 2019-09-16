/**
 * Gets the tableName property
 * @param {Array} tables Total tables
 * @param {string} id The id to match the desired table
 * @return {string} Name of the table
 */
export const getTableName = (tables, id) => {
  let tableName = "";
  tables.forEach(table => {
    if (table.tableId === id) {
      tableName = table.tableName;
    }
  });
  return tableName;
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
