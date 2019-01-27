const addTodo = function() {
  fetch("/add")
    .then(res => res.text())
    .then(html => (document.documentElement.innerHTML = html));
};

const displayData = function(res) {
  document.getElementById("mainContainer").innerHTML = res;
};

const addListItem = function(items) {
  return items.map(({ description, status }) => {
    return `<li>${description} - ${status}</li>`;
  }).join("");
};

const createHTML = function(data) {
  return data
    .map(({ title, items }) => {
      let contents = `<form action="/serveAddItemPage?${title}" method="POST"><label>${title}</label><input type='submit' value= 'ADD'></form>`;
      contents += addListItem(items);
      return contents;
    })
    .join("");
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
