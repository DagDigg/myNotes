import { API } from "aws-amplify";

export const getNotes = async () => {
  return await API.get("notes", "/notes");
};

/**
 * PUTs noteTable property to note
 * @param {Array} note The correct note to be updated
 *
 * @return {Promise} Promise response
 */
export const updateNoteTable = async note => {
  const noteId = note.noteId;
  let response;
  try {
    response = API.put("notes", `/notes/${noteId}`, {
      body: {
        content: note.content,
        attachment: note.attachment,
        noteTable: note.noteTable
      }
    });
  } catch (e) {
    alert(e);
  }

  return await response;
};
