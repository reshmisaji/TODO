const getTitle = () => document.getElementById("title").innerText;

const displayData = function(res) {
  document.getElementById("itemContainer").innerHTML = res;
};

const addListItem = function(items) {
  const title = getTitle();
  return items
    .map(({ description, status }) => {
      return `<br />
      <div class="lists"> ${description}   
        <input type="submit" class="todo"  value="${status}" onclick='toggle("${status}","${description}")'/>   
        <input type="submit" class="edit" value="EDIT" onclick='edit("${status}","${description}","${title}")' />
        <input type='submit' value='DELETE' class="delete" onclick='deleteItem("${description}","${status}")'/>
        </div> `;
    })
    .join("");
};

        // <form method="POST" action="/serveEditPage?title=${title}&description=${description}&status=${status}">
        // </form>   
// const edit = function(description,status){
//   const title = getTitle();
//   fetch(`/edit?title=${title}&description=${description}&status=${status}`)
//   .then(res=>res.json())
// }

const edit = function(status, description, title){
  fetch('/serveEditPage',{method:'POST',body:JSON.stringify({title,description,status})})
  .then(res => res.text())
  .then(html => document.documentElement.innerHTML = html)
  // .then(html => {
  //   window.location.href = '/';
  //   document.documentElement.innerHTML = html
  // });
}

const toggle = function(status,description){
  const title = getTitle();
  fetch(`/toggleStatus`,{method:'POST',body:JSON.stringify({title, description, status})})
  .then(res=>res.json())
  .then(result=>createHTML(result))
  .then(html=>displayData(html))

}

const deleteItem = function(description, status) {
  const title = getTitle();
  fetch(`/deleteItem`,{method:'POST',body:JSON.stringify({title, description, status})})
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
