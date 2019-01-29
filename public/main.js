const addTodo = function() {
  fetch("/add")
    .then(res => res.text())
    .then(html => (document.documentElement.innerHTML = html));
};

const displayData = function(res) {
  document.getElementById("mainContainer").innerHTML = res;
};

const createHTML = function(data) {
  console.log(data);
  return data
    .map(({ title }) => {
      let contents = `<br /><div class="lists">${title}   <a href="/list?${title}" ><input type="submit" value="OPEN" class="todo" /></a>   <input type='submit' value='DELETE' class="delete" onclick='deleteList("${title}")'/></div>`;
      return contents;
    })
    .join("");
};

const deleteList = function(title) {
  fetch(`/deleteList?title=${title}`)
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
