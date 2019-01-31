const List = require("../todo_list");
const Item = require("../todo_item");
const Lists = require("../todo_lists");

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
  addUser
} = require('./handlers');

const { Express } = require("./express");
const app = new Express();
const fs = require("fs");

let todos;
let userCredentials;

const readUserCredentialsFile = function(fs) {
  if (!fs.existsSync("./userCredentials.json")) {
    fs.writeFileSync("./userCredentials.json", "[]");
  }
  return JSON.parse(fs.readFileSync("./userCredentials.json"));
};

const readTodoFile = function(fs) {
  if (!fs.existsSync("./todos.json")) {
    fs.writeFileSync("./todos.json", "[]");
  }
  return JSON.parse(fs.readFileSync("./todos.json"));
};

const initialiseListItems = function(content) {
  content.forEach(user =>
    user.lists.forEach(list => {
      list.items = list.items.map(
        item => new Item(item.description, item.status)
      );
    })
  );
  return content;
};

const initialiseTodoLists = function(content) {
  let todos;
  content.forEach(user => {
    user.lists = user.lists.map(list => new List(list.title, list.items));
    todos = user.lists;
  });
  return todos || [];
};

const readTodo = function(fs) {
  let content = readTodoFile(fs);
  content = initialiseListItems(content);
  let todo = initialiseTodoLists(content);
  todos = new Lists("Ankon", todo);
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
app.post("/todoList", addTodo.bind(null, fs, todos, cache));
app.post(/\/addItem/, addItem.bind(null, fs, todos, cache));
app.post(/\/serveAddItemPage/, renderAddItemPage.bind(null, cache));
app.post(/\/serveEditPage/, renderEditPage.bind(null, cache));
app.post("/editItem", editItem.bind(null, todos, fs));
app.get("/todos", serveTodos.bind(null, todos));
app.get(/\/todoItems?/, serveItems.bind(null, todos));
app.post("/deleteItem", deleteItem.bind(null, todos, fs));
app.post("/toggleStatus", toggle.bind(null, todos, fs));
app.post("/deleteList", deleteTodo.bind(null, todos, fs));
app.post('/renderEditTodoPage',renderEditTodoPage.bind(null, cache))
app.post('/editTodo',editTodo.bind(null,todos,fs));
app.post('/userSignUp',addUser.bind(null, fs, userCredentials));
app.get("/todoList", renderTodos.bind(null, cache));
app.get("/add?", renderAddTodoPage.bind(null, cache));
app.get(/\/list?/, renderTodo.bind(null, cache));
app.get("/index", renderHomePage.bind(null, cache));
app.get("/signUpPage", renderSignUpPage.bind(null, cache));
app.get("/login", login.bind(null, cache));
app.use(serveFile.bind(null, cache));

const requestHandler = app.handleRequest.bind(app);
module.exports = {
  requestHandler,
  readTodoFile,
  initialiseListItems,
  initialiseTodoLists
};
