const getTitle = () => document.getElementById("title").innerText;

const toggleStatus = function() {
  const status = document.getElementsByName("status");
  status.forEach(state => {
    if (state.value == "Done") {
      state.className = "done";
    }
  });
};

const displayData = function(res) {
  document.getElementById("itemContainer").innerHTML = res;
  toggleStatus();
};

const addListItem = function(items, todoId) {
  const title = getTitle();
  return items
    .map(({ description, status, id }) => {
      return `<br />
      <div class="lists"> ${description}   
        <input name="status" type="submit" class="todo"  value="${status}" onclick='toggle(${id}, ${todoId})'/>   
        <input type="submit" class="edit" value="EDIT" onclick='edit(${id},${todoId},"${title}","${description}")' />
        <input type='submit' value='DELETE' class="delete" onclick='deleteItem(${id},${todoId})'/>
        </div> `;
    })
    .join("");
};

const edit = function(id, todoId, title, description) {
  fetch("/serveEditPage", {
    method: "POST",
    body: JSON.stringify({ id, todoId, title, description})
  })
    .then(res => res.text())
    .then(html => (document.documentElement.innerHTML = html));
};

const toggle = function(id, todoId) {
  fetch(`/toggleStatus`, {
    method: "POST",
    body: JSON.stringify({ id , todoId })
  })
    .then(res => res.json())
    .then(result => createHTML(result))
    .then(html => displayData(html));
};

const deleteItem = function(id, todoId) {
  // const title = getTitle();
  fetch(`/deleteItem`, {
    method: "POST",
    body: JSON.stringify({ id, todoId })
  })
    .then(res => res.json())
    .then(result => createHTML(result))
    .then(html => displayData(html));
};

const createHTML = function(data) {
  let contents = "";
  return data
    .map(({ items,id}) => {
      contents += addListItem(items, id);
      return contents;
    })
    .join("");
};

const initialize = function() {
  const id = document.getElementById('id').value;
  fetch(`/todoItems?${id}`)
    .then(res => res.json())
    .then(result => createHTML(result))
    .then(html => displayData(html));
};

window.onload = initialize;
