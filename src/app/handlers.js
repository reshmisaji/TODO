const Item = require("../todo_item");
const List = require("../todo_list");
const ERROR_404 = "404: Resource Not Found";
const ERROR_500 = "500: Internal Server Error";

const getRequestedFilePath = function(url) {
  return `.${url}`;
};

const send = function(res, data, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
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

const serveFile = function(cache, req, res) {
  const requestedFilePath = getRequestedFilePath(req.url);
  const fileContent = cache[requestedFilePath];
  serveData(res, fileContent);
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

const append = function(todoList, lists) {
  const list = initialiseNewList(todoList);
  lists.addList(list);
};

const readBody = function(req, res, next) {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const renderTodoList = function(cache, req, res) {
  send(res, cache["./todolist.html"], 200);
};

const addTodo = function(fs, lists, cache, req, res) {
  const todoList = readArgs(req.body);
  append(todoList, lists);
  fs.writeFile("./todos.json", JSON.stringify([lists]), () => {});
  renderTodoList(cache, req, res);
};

const serveTodos = function(lists, req, res) {
  send(res, JSON.stringify(lists.lists), 200);
};

const serveAddItemPage = function(cache, req, res) {
  const title = req.body;
  const addItemPage = cache["./addItem.html"]
    .toString()
    .replace("#title#", title);
  send(res, addItemPage, 200);
};

const serveAddTodoForm = function(cache, req, res) {
  send(res, cache["./todoForm.html"], 200);
};

module.exports = {
  readBody,
  renderTodoList,
  addTodo,
  serveTodos,
  serveAddItemPage,
  serveAddTodoForm,
  serveFile,
  send,
  serveData,
  isFileNotFound,
  getRequestedFilePath,
  splitKeyValue,
  readArgs,
  initialiseNewList,
  append
};
