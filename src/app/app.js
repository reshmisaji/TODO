const List = require("../todo_list");
const Item = require("../todo_item");
const Lists = require("../todo_lists");

const {
  readBody,
  renderTodoList,
  addTodo,
  serveTodos,
  serveAddItemPage,
  serveAddTodoForm,
  serveFile,
  addItem,
  logRequest,
  serveList,
  serveItems,
  deleteGivenItem,
  deleteGivenList,
  toggle,
  serveEditPage,
  editItem
} = require("./handlers");

const { Express } = require("./express");
const app = new Express();
const fs = require("fs");

let lists;

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
  let todos = initialiseTodoLists(content);
  lists = new Lists("Ankon", todos);
};

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
app.post("/todoList", addTodo.bind(null, fs, lists, cache));
app.post(/\/serveAddItemPage/, serveAddItemPage.bind(null, cache));
app.post(/\/addItem/, addItem.bind(null, fs, lists, cache));
app.post(/\/serveEditPage/, serveEditPage.bind(null, cache));
app.post('/editItem', editItem.bind(null, lists,fs));
app.get("/todos", serveTodos.bind(null, lists));
app.get(/\/todoItems?/, serveItems.bind(null, lists));
app.post(/\/deleteItem/, deleteGivenItem.bind(null, lists, fs));
app.post(/\/toggleStatus/, toggle.bind(null, lists, fs));
app.post(/\/deleteList/, deleteGivenList.bind(null, lists, fs));
app.get("/todoList", renderTodoList.bind(null, cache));
app.get("/add?", serveAddTodoForm.bind(null, cache));
app.get(/\/list?/, serveList.bind(null, cache));
app.use(serveFile.bind(null, cache));

const requestHandler = app.handleRequest.bind(app);
module.exports = {
  requestHandler,
  readTodoFile,
  initialiseListItems,
  initialiseTodoLists
};
