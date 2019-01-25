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
  });
};

const createHTML = function(data) {
  return data
    .map(({ title, items }) => {
      let contents = `<div>${title}<input type='submit' value= 'ADD' onclick='addItem()'></button></div>`;
      contents += addListItem(items);
      return contents;
    })
    .join("");
};

const updateList = function(){
  const item = document.getElementById('item').value;
  const listName = event.target.parentElement.innerText;
  fetch('/addItem',{method:'POST',body:JSON.stringify({item,listName})})
}

const addItem = function() {
  const title = event.target.parentElement.innerText;
  fetch("/addItemToList", { method: "POST", body: title })
    .then(res => res.text())
    .then(html => (document.documentElement.innerHTML = html));
};

const initialize = function() {
  fetch("/todos")
    .then(res => res.json())
    .then(result => {console.log(result); return createHTML(result)})
    .then(html => displayData(html));
};

window.onload = initialize;
