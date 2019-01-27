const chai = require("chai");
const {
  readTodoFile,
  initialiseListItems,
  initialiseTodoLists
} = require("../../src/app/app");

const files = {};

const fs = {
  existsSync: path => Object.keys(files).includes(path),
  readFileSync: path => files[path],
  writeFileSync: (path, data) => (files[path] = data)
};

describe("readTodoFile", () => {
  it('should create and write "[]" to the file if the file does not exists', () => {
    readTodoFile(fs);
    const actualOutput = files["./todos.json"];
    const expectedOutput = "[]";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });

  it("should give the content of the path", () => {
    const actualOutput = readTodoFile(fs);
    const expectedOutput = [];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
});

describe("initialiseListItems", () => {
  it("should give the list items with the instance of the class", () => {
    const content = [
      {
        userName: "Ankon",
        lists: [
          {
            title: "ankon",
            items: [
              {
                description: "ankon",
                statuses: ["TODO", "Done"],
                status: "TODO"
              }
            ]
          }
        ]
      }
    ];
    const actualOutput = initialiseListItems(content);
    const expectedOutput = [
      {
        userName: "Ankon",
        lists: [
          {
            title: "ankon",
            items: [
              {
                description: "ankon",
                statuses: ["TODO", "Done"],
                status: "TODO"
              }
            ]
          }
        ]
      }
    ];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
});

describe("initialiseTodoLists", () => {
  it("should give the lists with the instance of the class", () => {
    const content = [
      {
        userName: "Ankon",
        lists: [
          {
            title: "ankon",
            items: [
              {
                description: "ankon",
                statuses: ["TODO", "Done"],
                status: "TODO"
              }
            ]
          }
        ]
      }
    ];
    const actualOutput = initialiseTodoLists(content);
    const expectedOutput = [
      {
        title: "ankon",
        items: [
          {
            description: "ankon",
            statuses: ["TODO", "Done"],
            status: "TODO"
          }
        ]
      }
    ];

    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });

  it('should give an empty array if there is no lists',()=>{
    const actualOutput = initialiseTodoLists([]);
    const expectedOutput = [];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  })
});
