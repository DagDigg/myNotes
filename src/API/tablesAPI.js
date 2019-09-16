import { API } from "aws-amplify";

//POSTs & UPDATEs

/**
 * Creates the initial table on SignUp
 * @return {Promise} Promise response
 */
export const postInitialTable = async () => {
  let result;
  try {
    result = API.post("notes", "/tables", {
      body: {
        tableName: "To Do"
      }
    });
  } catch (e) {
    alert(e);
  }
  return await result;
};

/**
 * POST a new Table
 * @param {string} tableName The name of the table
 * @return {Promise} Promise response
 */
export const createTable = async tableName => {
  let result;
  try {
    result = API.post("notes", "/tables", {
      body: {
        tableName: tableName
      }
    });
  } catch (e) {
    alert(e);
  }
  return await result;
};

/**
 * Updates the desired table
 * @param {string} tableId ID of the table
 * @param {string} tableName Name of the table
 * @param {Array} notes Notes Array to be updated
 * @return {Promise} Promise response
 */
export const updateTable = async (tableId, tableName, notes) => {
  let result;
  try {
    result = API.put("notes", `/tables/${tableId}`, {
      body: {
        tableName: tableName,
        notes: notes
      }
    });
  } catch (e) {
    alert(e);
  }
  return result;
};

//GETs & LISTs

/**
 * Gets the Table Object based on the tableId
 * @param {string} tableId ID of the table
 * @return {Promise} Promise response
 */
export const getTable = async tableId => {
  let result;
  try {
    result = API.get("notes", `/tables/${tableId}`);
  } catch (e) {
    alert(e);
  }
  return await result;
};

export const listTables = async () => {
  let result;
  try {
    result = API.get("notes", "/tables");
  } catch (e) {
    alert(e);
  }
  return await result;
};
