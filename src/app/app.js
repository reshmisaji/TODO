const {
  renderTodos,
  addTodo,
  serveTodos,
  deleteTodo,
  renderAddTodoPage,
  serveItems,
  renderEditTodoPage,
  editTodo,
  deleteItem,
  toggle,
  editItem,
  renderEditPage,
  addItem,
  renderTodo,
  renderAddItemPage,
  readBody,
  serveFile,
  logRequest,
  renderHomePage,
  renderSignUpPage,
  login,
  addUser,
  handleLogin,
  readTodo,
  logout
} = require("./handlers");

const { Express } = require("./express");
const app = new Express();
const fs = require("fs");

let userCredentials;

const readUserCredentialsFile = function(fs) {
  if (!fs.existsSync("./userCredentials.json")) {
    fs.writeFileSync("./userCredentials.json", "{}");
  }
  return JSON.parse(fs.readFileSync("./userCredentials.json"));
};

userCredentials = readUserCredentialsFile(fs);
readTodo(fs);

const cache = {};

const addCache = function(fs, fileName) {
  const content = fs.readFileSync(`./public/${fileName}`);
  cache[`./${fileName}`] = content;
};

const filesToRead = fs.readdirSync("./public");
filesToRead.forEach(addCache.bind(null, fs));

app.use(readBody);
app.use(logRequest);
app.post("/todoList", addTodo.bind(null, fs, cache));
app.post(/\/addItem/, addItem.bind(null, fs, cache));
app.post(/\/serveAddItemPage/, renderAddItemPage.bind(null, cache));
app.post(/\/serveEditPage/, renderEditPage.bind(null, cache));
app.post("/editItem", editItem.bind(null, fs));
app.get("/todos", serveTodos.bind(null));
app.get(/\/todoItems?/, serveItems.bind(null));
app.post("/deleteItem", deleteItem.bind(null, fs));
app.post("/toggleStatus", toggle.bind(null, fs));
app.post("/deleteList", deleteTodo.bind(null, fs));
app.post("/renderEditTodoPage", renderEditTodoPage.bind(null, cache));
app.post("/editTodo", editTodo.bind(null, fs));
app.post("/userSignUp", addUser.bind(null, fs, userCredentials));
app.post("/login", handleLogin.bind(null, userCredentials, fs));
app.get("/todoList", renderTodos.bind(null, cache));
app.get("/add?", renderAddTodoPage.bind(null, cache));
app.get(/\/list?/, renderTodo.bind(null, cache));
app.get("/index", renderHomePage.bind(null, cache));
app.get("/signUpPage", renderSignUpPage.bind(null, cache));
app.get("/login", login.bind(null, cache));
app.get("/logout", logout.bind(null, cache));
app.use(serveFile.bind(null, cache));

const requestHandler = app.handleRequest.bind(app);
module.exports = {
  requestHandler
};
