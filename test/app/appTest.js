const { send, readFiles,todoList } = require("../../src/app/app");
const chai = require("chai");

const res = {
  body: "",
  statusCode: 200,
  write: function(data) {
    this.body = data;
  },
  end: function() {
    return this.body;
  }
};

const req = {
  url: "/todo_list"
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
