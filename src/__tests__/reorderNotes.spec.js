import { reorderNotes } from "../utils/notesUtils";

describe("Reorder unordered notes by table notes order", () => {
  test("It should reorder notes", () => {
    const inputTables = [
      {
        tableId: "table1",
        notes: [{ noteId: "note1" }, { noteId: "note2" }]
      },
      {
        tableId: "table2",
        notes: [{ noteId: "note3" }, { noteId: "note4" }]
      }
    ];

    const inputNotes = {
      table1: [
        { noteId: "note2", content: "content2" },
        { noteId: "note1", content: "content1" }
      ],
      table2: [
        { noteId: "note4", content: "content4" },
        { noteId: "note3", content: "content3" }
      ]
    };

    const output = {
      table1: [
        { noteId: "note1", content: "content1" },
        { noteId: "note2", content: "content2" }
      ],
      table2: [
        { noteId: "note3", content: "content3" },
        { noteId: "note4", content: "content4" }
      ]
    };

    expect(reorderNotes(inputNotes, inputTables)).toEqual(output);
  });
});
