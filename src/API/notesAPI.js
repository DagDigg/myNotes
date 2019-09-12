import { API } from "aws-amplify";

export const getNotes = async () => {
  return await API.get("notes", "/notes");
};
