import { API } from "aws-amplify";

//POSTs & UPDATEs
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
