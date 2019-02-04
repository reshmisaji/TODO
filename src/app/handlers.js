const Item = require("../todo_item");
const List = require("../todo_list");
const Lists = require("../todo_lists");
const url = require('url');

let users = {};
let todo;
let cookies = [];
const restrictedPaths = [
  "/todoList",
  "/addItem",
  "/serveAddItemPage",
  "/serveEditPage",
  "/editItem",
  "/todos",
  "/todoItems",
  "/deleteItem",
  "/toggleStatus",
  "/deleteList",
  "/renderEditTodoPage",
  "/editTodo",
  "/todoList",
  "/add",
  "/list"
];

const allowedPaths = ["/userSignUp", "/login", "/signUpPage", "/index"];

const renderHome = function(req, res){
  res.redirect('/login');
}

const getUserId = function(cookie) {
  return cookie.id;
};

const readTodoFile = function(fs) {
  if (!fs.existsSync("./todos.json")) {
    fs.writeFileSync("./todos.json", "{}");
  }
  return JSON.parse(fs.readFileSync("./todos.json"));
};

const initialiseListItems = function(users) {
  Object.keys(users).forEach(user =>
    users[user].lists.forEach(list => {
      list.items = list.items.map(
        item => new Item(item.description, item.status)
      );
    })
  );
  return users;
};

const initialiseTodoLists = function(users, userId) {
  let todos;
  Object.keys(users)
    .filter(user => user == userId)
    .forEach(user => {
      users[user].lists = users[user].lists.map(
        list => new List(list.title, list.items)
      );
      todos = users[user].lists;
    });
  return todos || [];
};

const readTodo = function(fs, userId) {
  let content = readTodoFile(fs);
  content = initialiseListItems(content);
  todo = initialiseTodoLists(content, userId);
};

const initialiseTodo = function(todoInfo) {
  const todoItem = new Item(todoInfo.item);
  const todo = new List(todoInfo.title, [todoItem]);
  return todo;
};

const decodeData = function(data) {
  return unescape(data.replace(/\+/g, " "));
};

const redirect = function(res, location, statusCode = 302) {
  res.statusCode = statusCode;
  res.setHeader("location", location);
  res.end();
};

const getDecodeData = function(todo) {
  const todoInfo = decodeData(JSON.stringify(todo));
  return initialiseTodo(JSON.parse(todoInfo));
};

const extractTitle = function(args) {
  return args.split("?")[1];
};

const getElementDetails = function(data, todos) {
  const { id, todoId } = JSON.parse(data);
  const elementInfo = todos.lists.filter(list => list.id == todoId)[0];
  return { id, elementInfo };
};

const renderHomePage = function( req, res) {
  res.render("./index.html");
};

const renderSignUpPage = function( req, res) {
  res.render("./signUp.html");
};

const addUser = function(fs, userCredentials, req, res) {
  const { userId, userName, password } = req.body;
  userCredentials[userId] = { userName, password };
  fs.writeFile(
    "./userCredentials.json",
    JSON.stringify(userCredentials),
    () => {}
  );
  redirect(res, "/login", 302);
};

const deleteItem = function(fs, req, res) {
  const todos = users[getUserId(req.cookies)];
  const { id, elementInfo } = getElementDetails(req.body, todos);
  elementInfo.deleteItem(id);
  fs.writeFile("./todos.json", JSON.stringify(users), () => {});
  res.send(JSON.stringify([elementInfo]));
};

const toggle = function(fs, req, res) {
  const todos = users[getUserId(req.cookies)];
  const { id, elementInfo } = getElementDetails(req.body, todos);
  elementInfo.items.forEach(item => {
    if (item.id == id) {
      item.toggleStatus();
    }
  });
  fs.writeFile("./todos.json", JSON.stringify(users), () => {});
  res.send(JSON.stringify([elementInfo]));
};

const editItem = function(fs, req, res) {
  const todos = users[getUserId(req.cookies)];
  const itemToUpdate = req.body;
  const { id, elementInfo } = getElementDetails(
    JSON.stringify(itemToUpdate),
    todos
  );
  elementInfo.items.forEach(item => {
    if (item.id == id) item.edit(itemToUpdate.item);
  });
  fs.writeFile("./todos.json", JSON.stringify(users), () => {});
  const urlToRedirect = `list?title=${elementInfo.title}&id=${
    itemToUpdate.todoId
  }`;
  redirect(res, urlToRedirect, 302);
};

const renderTodo = function(req, res) {
  let {title, id} = url.parse(req.url,true).query;
  title = decodeData(title);
  res.render("list.html", (err, data)=>{
    const html = data
      .replace(/#title#/g, title)
      .replace(/#id#/g, id);
    res.send(html);
  })
};

const renderEditPage = function( req, res) {
  const { id, todoId, title, description } = JSON.parse(req.body);
  res.render("editList.html", (err, data)=>{
    const html = data
      .replace(/#title#/g, title)
      .replace(/#id#/g, id)
      .replace(/#todoId#/g, todoId)
      .replace(/#description#/g, description);
    res.send(html);
  })
};

const addItem = function(fs,  req, res) {
  const todos = users[getUserId(req.cookies)];
  const itemToAdd = req.body;
  const { elementInfo } = getElementDetails(JSON.stringify(itemToAdd), todos);
  const item = new Item(itemToAdd.item);
  elementInfo.addItem(item);
  fs.writeFile("./todos.json", JSON.stringify(users), () => {});
  const urlToRedirect = `list?title=${elementInfo.title}&id=${
    itemToAdd.todoId
  }`;
  redirect(res, urlToRedirect, 302);
};

const renderAddItemPage = function( req, res) {
  const { id } = req.body;
  let {title} = url.parse(req.url,true).query;
  res.render("addItem.html", (err, data)=>{
    const html = data
      .replace(/#title#/g, title)
      .replace(/#id#/g, id);
    res.send(html);
  })
};

const append = function(todo, todos) {
  const decodedTodo = getDecodeData(todo);
  todos.addList(decodedTodo);
};

const renderTodos = function( req, res) {
  res.render("todolist.html");
};

const addTodo = function(fs,  req, res) {
  const todos = users[getUserId(req.cookies)];
  const todoDetails = req.body;
  append(todoDetails, todos);
  fs.writeFile("./todos.json", JSON.stringify(users), () => {});
  renderTodos( req, res);
};

const serveTodos = function(req, res) {
  console.log(req.cookies);
  const todos = users[getUserId(req.cookies)];
  res.send(JSON.stringify(todos.lists));
};

const deleteTodo = function(fs, req, res) {
  const todos = users[getUserId(req.cookies)];
  const { elementInfo } = getElementDetails(req.body, todos);
  const todoToDeleteDetails = new List(elementInfo.title, elementInfo.items);
  todoToDeleteDetails.id = elementInfo.id;
  todos.deleteList(todoToDeleteDetails);
  fs.writeFile("./todos.json", JSON.stringify(users), () => {});
  res.send(JSON.stringify(todos.lists));
};

const renderAddTodoPage = function( req, res) {
  res.render("./todoForm.html");
};

const serveItems = function(req, res) {
  const todos = users[getUserId(req.cookies)];
  const id = extractTitle(req.url);
  const requiredList = todos.lists.filter(todo => todo.id == id);
  res.send(JSON.stringify(requiredList));
};

const renderEditTodoPage = function( req, res) {
  const { title, todoId } = JSON.parse(req.body);
  res.render("editTodo.html", (err, data)=>{
    const html = data
      .replace(/#title#/g, title)
      .replace(/#todoId#/g, todoId);
    res.send(html);
  })
};

const editTodo = function(fs, req, res) {
  const todos = users[getUserId(req.cookies)];
  const todoToEdit = req.body;
  const { elementInfo } = getElementDetails(JSON.stringify(todoToEdit), todos);
  elementInfo.editTitle(todoToEdit.title);
  fs.writeFile("./todos.json", JSON.stringify(users), () => {});
  redirect(res, "/todoList", 302);
};

const handleLogin = function(userCredentials, fs, req, res) {
  const { userId, password } = req.body;
  readTodo(fs, userId);
  users[userId] = new Lists(todo);
  if (userCredentials[userId] && userCredentials[userId].password == password) {
    // const cookie = `id=${userId};token=${new Date().toString()}`;
    cookies.push({ id: userId });
    res.cookie("id", userId, { encode: String });
    // res.setHeader("Set-Cookie", cookie);
    todos = users[userId];
    fs.writeFile("./todos.json", JSON.stringify(users), () => {});
    redirect(res, "/todoList", 302);
    return;
  }
  redirect(res, "/login", 302);
};

const login = function( req, res) {
  res.render("index.html");
};

const logout = function( req, res) {
  // todos = {};
  res.setHeader("Set-Cookie", "id=;expires=Thu, 01 Jan 1970 00:00:01 GMT;");
  redirect(res, "/login", 302);
};

const isPresent = function(source, element) {
  return source.filter(x => x.id == element.id).length;
};

const validateCookie = function(req, res, next) {
  const cookie = req.cookies;
  const {pathname} = url.parse(req.url, true)
  if (restrictedPaths.includes(pathname)) {
    if (cookie.id && isPresent(cookies, cookie)) {
      next();
      return;
    }
    redirect(res, "/login", 302);
    return;
  }
  if (allowedPaths.includes(req.url) && cookie.id) {
    redirect(res, "/todoList", 302);
    return;
  }
  next();
};

module.exports = {
  decodeData,
  redirect,
  getDecodeData,
  extractTitle,
  getElementDetails,
  renderHomePage,
  renderSignUpPage,
  login,
  addUser,
  editTodo,
  renderEditTodoPage,
  serveItems,
  renderAddTodoPage,
  deleteTodo,
  addTodo,
  serveTodos,
  addItem,
  renderAddItemPage,
  deleteItem,
  toggle,
  editItem,
  renderTodo,
  renderTodos,
  renderEditPage,
  handleLogin,
  readTodo,
  logout,
  validateCookie,
  renderHome
};
