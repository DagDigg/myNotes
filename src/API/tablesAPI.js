import { API } from "aws-amplify";

export const postInitialTable = async () => {
  let result;
  try {
    result = API.post("notes", "/tables", {
      body: {
        tableId: "initial"
      }
    });
  } catch (e) {
    alert(e);
  }
  return await result;
};

export const getTableNotes = async tableId => {
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
