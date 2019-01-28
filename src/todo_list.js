class List {
  constructor(title, items) {
    this.title = title;
    this.items = items;
  }

  addItem(item) {
    this.items.push(item);
  }

  deleteItem(item) {
    this.items = this.items.filter(isEqual.bind(null, item));
    // items.map(item => {
    //   const index = this.items.indexOf(item);
    //   this.items.splice(index, 1);
    // });
  }

  editTitle(title){
    this.title = title;
  }
}

const isEqual = function(first, second){
  const comparisons = Object.keys(first).filter(key => first[key] == second[key]);
  return comparisons.length != 2;
}

module.exports = List;
