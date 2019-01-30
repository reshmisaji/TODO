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

const initialiseTodo = function(todoInfo) {
  const todoItem = new Item(todoInfo.item);
  const todo = new List(todoInfo.title, [todoItem]);
  return todo;
};

const getDecodeData = function(todo) {
  const todoInfo = decodeData(JSON.stringify(todo));
  return initialiseTodo(JSON.parse(todoInfo));
};

const append = function(todo, todos) {
  const decodedTodo = getDecodeData(todo);
  todos.addList(decodedTodo);
};

const readBody = function(req, res, next) {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const renderTodos = function(cache, req, res) {
  send(res, cache["./todolist.html"], 200);
};

const addTodo = function(fs, todos, cache, req, res) {
  const todoDetails = readArgs(req.body);
  append(todoDetails, todos);
  fs.writeFile("./todos.json", JSON.stringify([todos]), () => {});
  renderTodos(cache, req, res);
};

const serveTodos = function(todos, req, res) {
  send(res, JSON.stringify(todos.lists), 200);
};

const extractTitle = function(args) {
  return args.split("?")[1];
};

const serveAddItemPage = function(cache, req, res) {
  const {id} = readArgs(req.body);
  const title = decodeData(extractTitle(req.url));
  const addItemPage = cache["./addItem.html"]
    .toString()
    .replace(/#title#/g, title)
    .replace(/#id#/g,id);
  send(res, addItemPage, 200);
};

const serveAddTodoPage = function(cache, req, res) {
  send(res, cache["./todoForm.html"], 200);
};

const updateTodoList = function(todos, title, [item]) {
  const todoToAdd = todos.lists.filter(todo => todo.title == title)[0];
  todoToAdd.addItem(item);
  todos.updateList(todoToAdd);
  return todos;
};

const addItem = function(fs, todos, cache, req, res) {
  const itemToAdd = readArgs(decodeData(req.body));
  const { elementInfo } = getElementDetails(JSON.stringify(itemToAdd),todos);
  const item = new Item(itemToAdd.item);
  elementInfo.addItem(item);
  fs.writeFile('./todos.json',JSON.stringify([todos]), ()=>{});
  const urlToRedirect = `list?title=${elementInfo.title}&id=${itemToAdd.todoId}`;
  redirect(res, urlToRedirect, 302);
};

const serveTodo = function(cache, req, res) {
  let { title, id } = readArgs(extractTitle(req.url));
  title = decodeData(title);
  const todoPage = cache["./list.html"].toString().replace(/#title#/g, title).replace(/#id#/g,id);
  send(res, todoPage, 200);
};

const serveItems = function(todos, req, res) {
  const id = extractTitle(req.url);
  const requiredList = todos.lists.filter(todo => todo.id == id);
  send(res, JSON.stringify(requiredList), 200);
};

const getElementDetails = function(data, todos) {
  const {id, todoId} = JSON.parse(data);
  const elementInfo = todos.lists.filter(list => list.id == todoId)[0];
  return { id, elementInfo };
};

const deleteGivenItem = function(todos, fs, req, res) {
  const {id, elementInfo} = getElementDetails(req.body, todos);
  elementInfo.deleteItem(id);
  fs.writeFile('./todos.json', JSON.stringify([todos]),()=>{});
  send(res, JSON.stringify([elementInfo]),200);
};

const deleteGivenTodo = function(todos, fs, req, res) {
  const { elementInfo } = getElementDetails(req.body, todos);
  const todoToDeleteDetails = new List(elementInfo.title, elementInfo.items);
  todoToDeleteDetails.id = elementInfo.id;
  todos.deleteList(todoToDeleteDetails);
  fs.writeFile("./todos.json", JSON.stringify([todos]), () => {});
  send(res, JSON.stringify(todos.lists), 200);
};

const toggle = function(todos, fs, req, res) {
  const {id, elementInfo} = getElementDetails(req.body, todos);
  elementInfo.items.forEach(item => {
    if(item.id == id){
      item.toggleStatus();
    }
  });
  fs.writeFile('./todos.json',JSON.stringify([todos]),()=>{});
  send(res, JSON.stringify([elementInfo]),200);
};

const serveEditPage = function(cache, req, res) {
  const {id, todoId, title, description} = JSON.parse(req.body);
  const editItemPage = cache["./editList.html"]
    .toString()
    .replace(/#id#/g, id)
    .replace(/#todoId#/g, todoId)
    .replace(/#title#/g,title)
    .replace(/#description#/g,description);
  send(res, editItemPage, 200);
};

const editItem = function(todos, fs, { body }, res) {
  const itemToUpdate = readArgs(decodeData(body));
  const { id, elementInfo} = getElementDetails(JSON.stringify(itemToUpdate), todos);
  elementInfo.items.forEach(item =>{
    if(item.id == id) item.edit(itemToUpdate.item);
  })
  fs.writeFile('./todos.json', JSON.stringify([todos]), ()=>{});
  const urlToRedirect = `list?title=${elementInfo.title}&id=${itemToUpdate.todoId}`;
  redirect(res, urlToRedirect, 302);
};

const serveHomePage = function(cache, req, res) {
  send(res, cache["./index.html"], 200);
};

const serveSignUpPage = function(cache, req, res) {
  send(res, cache["./signUp.html"], 200);
};

const login = function(arguments) {
  return;
};

module.exports = {
  readBody,
  renderTodos,
  addTodo,
  serveTodos,
  serveAddItemPage,
  serveAddTodoPage,
  serveFile,
  send,
  serveData,
  isFileNotFound,
  getRequestedFilePath,
  splitKeyValue,
  readArgs,
  initialiseTodo,
  append,
  addItem,
  logRequest,
  extractTitle,
  updateTodoList,
  serveTodo,
  serveItems,
  deleteGivenItem,
  deleteGivenTodo,
  toggle,
  serveEditPage,
  editItem,
  serveHomePage,
  serveSignUpPage,
  login
};
