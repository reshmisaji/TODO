const List = require("../todo_list");

const {
  decodeData,
  getDecodeData,
  send,
  readArgs,
  extractTitle,
  getElementDetails,
  redirect
} = require('./handlers');

const append = function(todo, todos) {
  const decodedTodo = getDecodeData(todo);
  todos.addList(decodedTodo);
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

const deleteTodo = function(todos, fs, req, res) {
  const { elementInfo } = getElementDetails(req.body, todos);
  const todoToDeleteDetails = new List(elementInfo.title, elementInfo.items);
  todoToDeleteDetails.id = elementInfo.id;
  todos.deleteList(todoToDeleteDetails);
  fs.writeFile("./todos.json", JSON.stringify([todos]), () => {});
  send(res, JSON.stringify(todos.lists), 200);
};

const renderAddTodoPage = function(cache, req, res) {
  send(res, cache["./todoForm.html"], 200);
};

const serveItems = function(todos, req, res) {
  const id = extractTitle(req.url);
  const requiredList = todos.lists.filter(todo => todo.id == id);
  send(res, JSON.stringify(requiredList), 200);
};

const renderEditTodoPage = function(cache, req, res){
  const {title, todoId} = JSON.parse(req.body);
  const editItemPage = cache["./editTodo.html"]
    .toString()
    .replace(/#todoId#/g, todoId)
    .replace(/#title#/g, title)
  send(res, editItemPage, 200);
}

const editTodo = function(todos, fs, req, res){
  const todoToEdit = readArgs(decodeData(req.body));
  const {elementInfo} = getElementDetails(JSON.stringify(todoToEdit),todos);
  elementInfo.editTitle(todoToEdit.title);
  fs.writeFile('./todos.json',JSON.stringify([todos]),()=>{});
  redirect(res, '/todoList',302);
}

module.exports = {
  renderTodos,
  addTodo,
  serveTodos,
  deleteTodo,
  renderAddTodoPage,
  serveItems,
  renderEditTodoPage,
  editTodo
};
