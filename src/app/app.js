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
  serveFile
} = require("./handlers");

const { Express } = require("./express");
const app = new Express();
const fs = require("fs");

let lists;

const readTodo = function(fs) {
  if (!fs.existsSync("./todos.json")) {
    fs.writeFileSync("./todos.json", "[]", () => {});
  }
  const content = JSON.parse(fs.readFileSync("./todos.json"));
  content.forEach(list => {
    list.items = list.items.map(item => new Item(item.description));
  });
  const todos = content.map(list => new List(list.title, list.items));
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
app.get("/todoList", renderTodoList.bind(null, cache));
app.post("/todoList", addTodo.bind(null, fs, lists, cache));
app.get("/todos", serveTodos.bind(null, lists));
app.post("/addItemToList", serveAddItemPage.bind(null, cache));
app.get("/add?", serveAddTodoForm.bind(null, cache));
app.use(serveFile.bind(null, cache));

const requestHandler = app.handleRequest.bind(app);
module.exports = { requestHandler };
