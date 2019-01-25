const {
  send,
  serveData,
  serveFile,
  isFileNotFound,
  getRequestedFilePath,
  splitKeyValue,
  readArgs,
  initialiseNewList,
  append
} = require("../../src/app/handlers");

// const Item = require('../../src/todo_item');
// const List = require('../../src/todo_list');
const Lists = require("../../src/todo_lists");
// const item = new Item('something');
// const list = new List('Office',[item]);
const lists = new Lists("Ankon", []);

const chai = require("chai");

const cache = {
  "./": "something"
};

const res = {
  body: "",
  statusCode: 200,
  write: function(data) {
    this.body = data;
  },
  end: function() {
    if (this.body == undefined) throw { code: "ENOENT" };
    return this.body;
  }
};

const req = {
  url: "/"
};

const files = {
  "/todo_list": `something else`
};

const fs = {
  readFile: function(path, callback) {
    let error;
    if (!files[path]) {
      error = "error";
    }
    const content = files[path];
    callback(error, content);
  }
};

describe("send", () => {
  it("should not modify the response body if send has not happened", () => {
    const actualOutput = res.body;
    const expectedOutput = "";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });

  it("should not modify the statusCode of the response if send has not happened", () => {
    const actualOutput = res.statusCode;
    const expectedOutput = 200;
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });

  it("should write to the response body if send happens and only data is provided", () => {
    send(res, "something");
    const actualOutput = res.body;
    const expectedOutput = "something";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });

  it("should not modify the statusCode if send happens and only data is provided", () => {
    send(res, "something");
    const actualOutput = res.statusCode;
    const expectedOutput = 200;
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });

  it("should modify the statusCode if send happens and both data and statusCode are provided", () => {
    send(res, "something", 404);
    const actualOutput = res.statusCode;
    const expectedOutput = 404;
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });

  it("should modify the body if send happens and both data and statusCode are provided", () => {
    send(res, "something", 404);
    const actualOutput = res.body;
    const expectedOutput = "something";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe("serveData", () => {
  it("should give the contents of the file in body", () => {
    serveData(res, "something");
    const actualOutput = res.body;
    const expectedOutput = "something";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe("serveFile", () => {
  it("should give the file content in the body if file exists", () => {
    serveFile(cache, req, res);
    const actualOutput = res.body;
    const expectedOutput = "something";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });

  it("should give file not found error in body if file doesnt exists", () => {
    req.url = "/todoList";
    serveFile(cache, req, res);
    const actualOutput = res.body;
    const expectedOutput = "404: Resource Not Found";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe("isFileNotFound", () => {
  it("should give true if the error code of 404 is given", () => {
    const actualOutput = isFileNotFound("ENOENT");
    const expectedOutput = true;
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });

  it("should give false if the error code of 404 is given", () => {
    const actualOutput = isFileNotFound("ENONENT");
    const expectedOutput = false;
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe("getRequestedFilePath", () => {
  it("should give the path of the url", () => {
    const url = "/todoList";
    const actualOutput = getRequestedFilePath(url);
    const expectedOutput = "./todoList";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe("splitKeyValue", () => {
  it('should give an array by splitting the string with "="', () => {
    const data = "name=ankon";
    const actualOutput = splitKeyValue(data);
    const expectedOutput = ["name", "ankon"];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
});

describe("readArgs", () => {
  it("should give an object by reading the arguments", () => {
    const arguments = "name=ankon&id=123";
    const actualOutput = readArgs(arguments);
    const expectedOutput = { name: "ankon", id: "123" };
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
});

describe("initialiseNewList", () => {
  it("should give the list object if give an object with title and item as keys", () => {
    const todo = { title: "test", item: "tests should pass" };
    const actualOutput = initialiseNewList(todo);
    const expectedOutput = {
      title: "test",
      items: [
        {
          description: "tests should pass",
          status: "TODO",
          statuses: ["TODO", "Done"]
        }
      ]
    };
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
});

describe("append", () => {
  it("should give the new lists if a list is appended", () => {
    const todoList = { title: "test", item: "something" };
    append(todoList, lists);
    const actualOutput = lists.lists;
    const expectedOutput = [
      {
        title: "test",
        items: [
          {
            description: "something",
            status: "TODO",
            statuses: ["TODO", "Done"]
          }
        ]
      }
    ];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
});
// describe('readFiles',() => {
//   it('should get the contents of the given file ',() => {
//     readFiles(req,res,()=>{});
//     const actualOutput = todoList;
//     const expectedOutput = `<!DOCTYPE html>
//     <html>
//     <head>
//       <title>todo list</title>
//       <script src="main.js"></script>
//     </head>
//     <body>
//       <header>TODO LISTS</header>
//       <main id="mainContainer"></main>
//     </body>
//     </html>`;
//     chai.expect(actualOutput).to.be.equal(expectedOutput);
//   });
// });

// describe("renderTodoList", () => {
//   it("should give the content for the file requested", () => {
//     renderTodoList(req, res);
//     const actualOutput = res.body;
//     const expectedOutput = "something else";
//     chai.expect(actualOutput).to.be.equal(expectedOutput);
//   });

//   it("should give the error if the file doesn't exists", () => {
//     req.url = '/todoList';
//     renderTodoList(req, res);
//     const actualOutput = res.body;
//     const expectedOutput = "page not found";
//     chai.expect(actualOutput).to.be.equal(expectedOutput);
//   });
// });
