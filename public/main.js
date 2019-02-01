const logout = function(){
  fetch("/logout")
  .then(res => res.text())
  .then(html => document.documentElement.innerHTML= html);
}

const addTodo = function() {
  fetch("/add")
    .then(res => res.text())
    .then(html => (document.documentElement.innerHTML = html));
};

const displayData = function(res) {
  document.getElementById("mainContainer").innerHTML = res;
};

const createHTML = function(data) {
  return data
    .map(({ title , id}) => {
      let contents = `
      <br />
      <div class="lists">${title}   
        <a href="/list?title=${title}&id=${id}" >
          <input type="submit" value="OPEN" class="todo" />
        </a>   
        <input type="submit" value="EDIT" class="edit" onclick='editTodo("${id}","${title}")'/>
        <input type='submit' value='DELETE' class="delete" onclick='deleteList("${id}")'/>
      </div>`;
      return contents;
    })
    .join("");
};

const editTodo = function(todoId, title){
  fetch(`/renderEditTodoPage`,{method:'POST',body:JSON.stringify({todoId, title})})
  .then(res => res.text())
  .then(html => document.documentElement.innerHTML = html)
}

const deleteList = function(todoId) {
  fetch(`/deleteList`,{method:'POST',body:JSON.stringify({todoId})})
    .then(res => res.json())
    .then(result => createHTML(result))
    .then(html => displayData(html));
};

const initialize = function() {
  fetch("/todos")
    .then(res => res.json())
    .then(result => {
      return createHTML(result);
    })
    .then(html => displayData(html));
};

window.onload = initialize;
