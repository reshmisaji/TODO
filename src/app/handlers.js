const Item = require("../todo_item");
const List = require("../todo_list");

const ERROR_404 = "404: Resource Not Found";

const initialiseTodo = function(todoInfo) {
  const todoItem = new Item(todoInfo.item);
  const todo = new List(todoInfo.title, [todoItem]);
  return todo;
};

const getRequestedFilePath = function(url) {
  return `.${url}`;
};

const logRequest = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

const decodeData = function(data) {
  return unescape(data.replace(/\+/g, " "));
};

const redirect = function(res, location, statusCode = 302) {
  res.statusCode = statusCode;
  res.setHeader("location", location);
  res.end();
};

const send = function(res, data, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
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

const getDecodeData = function(todo) {
  const todoInfo = decodeData(JSON.stringify(todo));
  return initialiseTodo(JSON.parse(todoInfo));
};

const readBody = function(req, res, next) {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const extractTitle = function(args) {
  return args.split("?")[1];
};

const getElementDetails = function(data, todos) {
  const { id, todoId } = JSON.parse(data);
  const elementInfo = todos.lists.filter(list => list.id == todoId)[0];
  return { id, elementInfo };
};

const renderHomePage = function(cache, req, res) {
  send(res, cache["./index.html"], 200);
};

const renderSignUpPage = function(cache, req, res) {
  send(res, cache["./signUp.html"], 200);
};

const login = function(arguments) {
  return;
};

module.exports = {
  readBody,
  serveFile,
  decodeData,
  redirect,
  getDecodeData,
  send,
  readArgs,
  logRequest,
  extractTitle,
  getElementDetails,
  renderHomePage,
  renderSignUpPage,
  login
};
