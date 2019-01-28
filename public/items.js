const getTitle = () => document.getElementById("title").innerText;

const displayData = function(res) {
  document.getElementById("itemContainer").innerHTML = res;
};

const addListItem = function(items) {
  return items.map(({ description, status }) => {
    return `<li>${description} - ${status}</li>`;
  }).join("");
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
