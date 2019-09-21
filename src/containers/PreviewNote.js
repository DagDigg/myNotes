import React, { useState } from "react";
import { createNote, getNote } from "../API/notesAPI";
import { updateTable } from "../API/tablesAPI";
import styled from "styled-components";

const NoteContainer = styled.div`
  height: auto;
  padding: 15px 0;
`;

const NoteCard = styled.div`
  background-color: ${props => props.theme.colors.noteColor};
  position: relative;
  text-align: center;
  width: 100%;
  height: 60px;
  border-radius: 15px;
  border: 1px solid transparent;
  transition: border 0.1s ease-in-out;
  &:hover {
    border: 1px solid ${props => props.theme.colors.secondaryText};
  }
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const NoteText = styled.textarea`
  border: none;
  resize: none;
  width: 80%;
  background-color: transparent;
  height: 35px;
  line-height: 30px;
  font-size: 18px;
  display: inline-block;
`;

const PreviewNote = ({ tableId, tableName, notes, updateTableNotes }) => {
  const [noteContent, setNoteContent] = useState("");

  const validateContent = () => {
    return noteContent.length > 0;
  };

  const saveNote = async () => {
    if (!validateContent()) {
      return;
    }

    const uuid = require("uuid/v1");
    const noteId = uuid();

    await createNote({
      noteId: noteId,
      noteTable: tableId,
      content: noteContent
    });

    await addNoteToTable(noteId);
  };

  const addNoteToTable = async noteId => {
    const newNotes = notes ? [...notes] : [];
    const idx = newNotes.length;
    const note = { noteId: noteId, noteIndex: idx };
    newNotes.push(note);

    updateTable(tableId, tableName, newNotes).then(() => {
      getNote(noteId).then(note => updateTableNotes(note));
    });
  };

  const handleTextChange = e => {
    if (noteContent.length < 40) {
      setNoteContent(e.target.value);
    }
  };

  const handleBlur = async () => {
    await saveNote();
  };

  const onEnterPress = async e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      await saveNote();
    }
  };

  return (
    <NoteContainer>
      <NoteCard>
        <TextContainer>
          <NoteText
            rows="1"
            placeholder="Enter note content..."
            value={noteContent}
            onChange={handleTextChange}
            onKeyDown={onEnterPress}
            onBlur={handleBlur}
          ></NoteText>
        </TextContainer>
      </NoteCard>
    </NoteContainer>
  );
};

export default PreviewNote;
