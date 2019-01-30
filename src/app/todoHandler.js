const Item = require("../todo_item");

const {
  decodeData,
  redirect,
  send,
  readArgs,
  extractTitle,
  getElementDetails
} = require('./handlers');

const deleteItem = function(todos, fs, req, res) {
  const { id, elementInfo } = getElementDetails(req.body, todos);
  elementInfo.deleteItem(id);
  fs.writeFile("./todos.json", JSON.stringify([todos]), () => {});
  send(res, JSON.stringify([elementInfo]), 200);
};

const toggle = function(todos, fs, req, res) {
  const { id, elementInfo } = getElementDetails(req.body, todos);
  elementInfo.items.forEach(item => {
    if (item.id == id) {
      item.toggleStatus();
    }
  });
  fs.writeFile("./todos.json", JSON.stringify([todos]), () => {});
  send(res, JSON.stringify([elementInfo]), 200);
};

const editItem = function(todos, fs, { body }, res) {
  const itemToUpdate = readArgs(decodeData(body));
  const { id, elementInfo } = getElementDetails(
    JSON.stringify(itemToUpdate),
    todos
  );
  elementInfo.items.forEach(item => {
    if (item.id == id) item.edit(itemToUpdate.item);
  });
  fs.writeFile("./todos.json", JSON.stringify([todos]), () => {});
  const urlToRedirect = `list?title=${elementInfo.title}&id=${
    itemToUpdate.todoId
  }`;
  redirect(res, urlToRedirect, 302);
};

const renderTodo = function(cache, req, res) {
  let { title, id } = readArgs(extractTitle(req.url));
  title = decodeData(title);
  const todoPage = cache["./list.html"]
    .toString()
    .replace(/#title#/g, title)
    .replace(/#id#/g, id);
  send(res, todoPage, 200);
};

const renderEditPage = function(cache, req, res) {
  const { id, todoId, title, description } = JSON.parse(req.body);
  const editItemPage = cache["./editList.html"]
    .toString()
    .replace(/#id#/g, id)
    .replace(/#todoId#/g, todoId)
    .replace(/#title#/g, title)
    .replace(/#description#/g, description);
  send(res, editItemPage, 200);
};

const addItem = function(fs, todos, cache, req, res) {
  const itemToAdd = readArgs(decodeData(req.body));
  const { elementInfo } = getElementDetails(JSON.stringify(itemToAdd), todos);
  const item = new Item(itemToAdd.item);
  elementInfo.addItem(item);
  fs.writeFile("./todos.json", JSON.stringify([todos]), () => {});
  const urlToRedirect = `list?title=${elementInfo.title}&id=${
    itemToAdd.todoId
  }`;
  redirect(res, urlToRedirect, 302);
};

const renderAddItemPage = function(cache, req, res) {
  const { id } = readArgs(req.body);
  const title = decodeData(extractTitle(req.url));
  const addItemPage = cache["./addItem.html"]
    .toString()
    .replace(/#title#/g, title)
    .replace(/#id#/g, id);
  send(res, addItemPage, 200);
};

module.exports = {
  deleteItem,
  toggle,
  editItem,
  renderEditPage,
  addItem,
  renderTodo,
  renderAddItemPage
};
