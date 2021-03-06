import { API } from "aws-amplify";

/**
 * Creates a note
 * @param {Object} note Note content
 */
export const createNote = note => {
  return API.post("notes", "/notes", {
    body: note
  });
};

/**
 * Gets total notes
 *
 * @return {Promise} Promise response
 */
export const getNotes = async () => {
  return await API.get("notes", "/notes");
};

/**
 * Gets a single note
 * @param {string} noteId ID of the note
 *
 * @return {Promise} Promise response
 */
export const getNote = async noteId => {
  let result;
  try {
    result = API.get("notes", `/notes/${noteId}`);
  } catch (e) {
    alert(e);
  }
  return await result;
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

/**
 * Deletes note by ID
 * @param {string} noteId ID of the note
 *
 * @return {Promise} Promise response
 */
export const deleteNote = async noteId => {
  let result;
  try {
    result = API.del("notes", `/notes/${noteId}`);
  } catch (e) {
    alert(e);
  }

  return await result;
};

/**
 * PUTs a note
 * @param {Object} note Note body value
 * @param {string} noteId ID of the note
 *
 * @return {Promise} Promise response
 */
export const saveNote = async (note, noteId) => {
  let result;
  try {
    result = API.put("notes", `/notes/${noteId}`, {
      body: note
    });
  } catch (e) {
    alert(e);
  }

  return await result;
};
