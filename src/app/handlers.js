const Item = require("../todo_item");
const List = require("../todo_list");
const ERROR_404 = "404: Resource Not Found";

const getRequestedFilePath = function(url) {
  return `.${url}`;
};

const logRequest = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

const decodeData = function(data){
  return unescape(data.replace(/\+/g,' '));
}

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
    send(res, ERROR_404, 404);
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
  todoList = decodeData(todoList);
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

const extractTitle = function(args) {
  return args.split("?")[1];
};

const serveAddItemPage = function(cache, req, res) {
  const title = extractTitle(req.url);
  const addItemPage = cache["./addItem.html"]
    .toString()
    .replace(/#title#/g, title);
  send(res, addItemPage, 200);
};

const serveAddTodoForm = function(cache, req, res) {
  send(res, cache["./todoForm.html"], 200);
};

const updateTodoList = function(lists, title, item) {
  const listToAdd = lists.lists.filter(list => list.title == title)[0];
  listToAdd.addItem(item);
  lists.updateList(listToAdd);
  return lists;
};

const addItem = function(fs, lists, cache, req, res) {
  const postData = readArgs(req.body);
  const decodedItem = decodeData(postData.item);
  const item = new Item(decodedItem);
  const title = extractTitle(req.url);
  const updatedLists = updateTodoList(lists, title, item);
  fs.writeFile("./todos.json", JSON.stringify([updatedLists]), () => {});
  res.statusCode = 302;
  res.setHeader('location', '/todoList');
  res.end();
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
  append,
  addItem,
  logRequest,
  extractTitle,
  updateTodoList
};
