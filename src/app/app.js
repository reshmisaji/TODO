const List = require("../todo_list");
const Item = require("../todo_item");

const { Express } = require("./express");
const app = new Express();
const fs = require("fs");

const ERROR_404 = "404: Resource Not Found";
const ERROR_500 = "500: Internal Server Error";

let todoPage;
let todos;

const cache = {};

const addCache = function(fileName) {
  const content = fs.readFileSync(`./public/${fileName}`);
  cache[`./${fileName}`] = content;
};

const filesToRead = fs.readdirSync("./public");
filesToRead.forEach(addCache);

const readTodo = function(){
  if(!fs.existsSync('./todos.json')){
    fs.writeFileSync('./todos.json','[]',()=>{});
  }
  return JSON.parse(fs.readFileSync("./todos.json"));
}

const readFiles = function(req, res, next) {
  todoPage = cache["./todolist.html"];
  todos = readTodo();
  next();
};

const getRequestedFilePath = function(url) {
  const requestedFilePath = `.${url}`;
  return requestedFilePath;
};

const isFileNotFound = function(errorCode) {
  return errorCode == "ENOENT";
};

const serveData = function(res, fileContent) {
  try {
    send(res, fileContent, 200);
  } catch (err) {
    if (isFileNotFound(err.code)) {
      send(res, ERROR_404, 404);
      return;
    }
    send(res, ERROR_500, 500);
  }
};

const serveFile = function(req, res) {
  const requestedFilePath = getRequestedFilePath(req.url);
  const fileContent = cache[requestedFilePath];
  serveData(res, fileContent);
};

const readBody = function(req, res, next) {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const splitKeyValue = pair => pair.split("=");

const readArgs = text => {
  const assignKeyValueToArgs = ([key, value]) => (args[key] = value);
  let args = {};
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const initialiseNewList = function(todo) {
  const item = new Item(todo.item);
  const list = new List(todo.title, [item]);
  return list;
};

const appendTodoList = function(todo) {
  const list = initialiseNewList(todo);
  todos.push(list);
};

const addTodo = function(req, res) {
  const todo = readArgs(req.body);
  appendTodoList(todo);
  fs.writeFile("./todos.json", JSON.stringify(todos), () => {});
  renderTodoList(req, res); //temporary , needs to change
};

const send = function(res, data, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
};

const renderTodoList = function(req, res) {
  send(res, todoPage, 200);
};

const serveTodos = function(req, res) {
  send(res, JSON.stringify(todos), 200);
};

const serveAddTodoForm = function(req, res) {
  send(res, cache["./todoForm.html"], 200);
};

app.use(readBody);
app.use(readFiles);
app.get("/todoList", renderTodoList);
app.post("/todoList", addTodo);
app.get("/todos", serveTodos);
app.get("/add?", serveAddTodoForm);
app.use(serveFile);

const requestHandler = app.handleRequest.bind(app);
module.exports = { send, readFiles, requestHandler, todoPage };
