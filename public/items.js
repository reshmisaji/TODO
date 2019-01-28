const getTitle = () => document.getElementById("title").innerText;

const displayData = function(res) {
  document.getElementById("itemContainer").innerHTML = res;
};

const addListItem = function(items) {
  return items
    .map(({ description, status }) => {
      return `<li>${description} - ${status}<input type='submit' value='delete' onclick='deleteItem("${description}")'/></li> `;
    })
    .join("");
};

const deleteItem = function(description) {
  const title = getTitle();
  fetch(`/deleteItem?title=${title}&description=${description}`).then(res =>
    res.json()
  );
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
