const getTitle = () => document.getElementById("title").innerText;

const displayData = function(res) {
  document.getElementById("itemContainer").innerHTML = res;
};

const addListItem = function(items) {
  return items
    .map(({ description, status }) => {
      return `<br /><div class="lists">${description}   <input type="submit" class="todo"  value="${status}" onclick='toggle("${status}","${description}")'/>   <input type='submit' value='delete' class="delete" onclick='deleteItem("${description}")'/></div> `;
    })
    .join("");
};

const toggle = function(status,description){
  const title = getTitle();
  fetch(`/toggleStatus?title=${title}&description=${description}&status=${status}`)
  .then(res=>res.json())
  .then(result=>createHTML(result))
  .then(html=>displayData(html))

}

const deleteItem = function(description) {
  const title = getTitle();
  fetch(`/deleteItem?title=${title}&description=${description}`)
    .then(res => res.json())
    .then(result => createHTML(result))
    .then(html => displayData(html));
};

const createHTML = function(data) {
  let contents = "";
  return data
    .map(({ items }) => {
      contents += addListItem(items);
      return contents;
    })
    .join("");
};

const initialize = function() {
  const title = getTitle();
  fetch(`/todoItems?${title}`)
    .then(res => res.json())
    .then(result => createHTML(result))
    .then(html => displayData(html));
};

window.onload = initialize;
