const {
  send,
  serveData,
  serveFile,
  isFileNotFound,
  getRequestedFilePath,
  splitKeyValue,
  readArgs,
  initialiseNewList,
  append,
  renderTodoList,
  serveTodos,
  serveAddItemPage,
  serveAddTodoForm,
  readBody, 
  addTodo
} = require("../../src/app/handlers");

const chai = require("chai");

const Lists = require("../../src/todo_lists");
const lists = new Lists("Ankon", []);

const cache = {
  "./": "something",
  "./todolist.html": "this is todo list",
  "./addItem.html": "#title# this is the add item form",
  "./todoForm.html": "this is the add todo form"
};

const res = {
  body: "",
  statusCode: 200,
  write: function(data) {
    this.body = data;
  },
  end: function() {
    if (this.body == undefined) throw new Error();
    return this.body;
  }
};

const req = {
  url: "/",
  body:'',
  on: (event, callback) => {
    if(event == 'data'){
      callback('data');
    }
    if(event == 'end'){
      callback();
    }
  }
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
  },
  writeFile: function(path, data, callback){
    files[path] = data;
    callback();
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

describe("renderTodoList", function() {
  it("should return the content in the './todolist.html' path in the cache", function() {
    renderTodoList(cache, req, res);
    const actualOutput = res.body;
    const expectedOutput = "this is todo list";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe("serveTodos", function() {
  it("should give the lists in the response body", function() {
    serveTodos(lists, req, res);
    actualOutput = res.body;
    expectedOutput = `[{"title":"test","items":[{"description":"something","statuses":["TODO","Done"],"status":"TODO"}]}]`;
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
});

describe("serveAddItemPage", function() {
  it("should gave the content of './addItem.html' in the response body ", function() {
    req.body = "Add item";
    serveAddItemPage(cache, req, res);
    const actualOutput = res.body;
    const expectedOutput = "Add item this is the add item form";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe("serveAddTodoForm", function() {
  it("should gave  the contents of './todoForm.html' in the response body ", function() {
    serveAddTodoForm(cache, req, res);
    const actualOutput = res.body;
    const expectedOutput = "this is the add todo form";
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe('readBody',() => {
  it('should give the content in request body',() => {
    readBody(req, res, ()=>{});
    const actualOutput = req.body;
    const expectedOutput = 'data';
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
});

describe('addTodo',() => {
  it('should give the todo list',() => {
    addTodo(fs, lists, cache, req, res);
    const actualOutput = res.body;
    const expectedOutput = 'this is todo list';
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  });
  
  it('should write data to the path',()=>{
    const actualOutput = files['./todos.json'];
    const expectedOutput = `[{"userName":"Ankon","lists":[{"title":"test","items":[{"description":"something","statuses":["TODO","Done"],"status":"TODO"}]},{"items":[{"statuses":["TODO","Done"],"status":"TODO"}]}]}]`;
    chai.expect(actualOutput).to.be.equal(expectedOutput);
  })
});