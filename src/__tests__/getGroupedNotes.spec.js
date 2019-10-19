import { getGroupedNotes } from "../utils/notesUtils";

describe("Group notes array into object", () => {
  test("It should group notes by table", () => {
    const inputTables = ["table1", "table2"];
    const inputNotes = [
      { noteTable: "table1", content: "content1" },
      { noteTable: "table2", content: "content2" }
    ];

    const output = {
      table1: [{ noteTable: "table1", content: "content1" }],
      table2: [{ noteTable: "table2", content: "content2" }]
    };

    expect(getGroupedNotes(inputTables, inputNotes)).toEqual(output);
  });
});
