const express  = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const view = require('ejs');
const logger = require('morgan');

const {
  renderTodos,
  addTodo,
  serveTodos,
  deleteTodo,
  renderAddTodoPage,
  serveItems,
  renderEditTodoPage,
  editTodo,
  deleteItem,
  toggle,
  editItem,
  renderEditPage,
  addItem,
  renderTodo,
  renderAddItemPage,
  renderHomePage,
  renderSignUpPage,
  login,
  addUser,
  handleLogin,
  readTodo,
  logout,
  validateCookie
} = require("./src/app/handlers");


let userCredentials;

const readUserCredentialsFile = function(fs) {
  if (!fs.existsSync("./userCredentials.json")) {
    fs.writeFileSync("./userCredentials.json", "{}");
  }
  return JSON.parse(fs.readFileSync("./userCredentials.json"));
};

userCredentials = readUserCredentialsFile(fs);
readTodo(fs);

app.set('views', __dirname + '/public/html');
app.engine('html', view.renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('public/html'));
app.use(express.static('public/css'));
app.use(express.static('public/scripts'));

app.use(validateCookie);
app.post("/todoList", addTodo.bind(null, fs));
app.post(/\/addItem/, addItem.bind(null, fs));
app.post(/\/serveAddItemPage/, renderAddItemPage.bind(null));
app.post(/\/serveEditPage/, renderEditPage.bind(null));
app.post("/editItem", editItem.bind(null, fs));
app.get("/todos", serveTodos.bind(null));
app.get(/\/todoItems?/, serveItems.bind(null));
app.post("/deleteItem", deleteItem.bind(null, fs));
app.post("/toggleStatus", toggle.bind(null, fs));
app.post("/deleteList", deleteTodo.bind(null, fs));
app.post("/renderEditTodoPage", renderEditTodoPage.bind(null));
app.post("/editTodo", editTodo.bind(null, fs));
app.post("/userSignUp", addUser.bind(null, fs, userCredentials));
app.post("/login", handleLogin.bind(null, userCredentials, fs));
app.get("/todoList", renderTodos.bind(null));
app.get("/add?", renderAddTodoPage.bind(null));
app.get(/\/list?/, renderTodo.bind(null));
app.get("/index", renderHomePage.bind(null));
app.get("/signUpPage", renderSignUpPage.bind(null));
app.get("/login", login.bind(null));
app.get("/logout", logout.bind(null));

app.listen(8080);
// const requestHandler = app.handleRequest.bind(app);
// module.exports = {
//   requestHandler
// };
