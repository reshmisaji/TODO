class List {
  constructor(title, items) {
    this.title = title;
    this.items = items;
  }

  addItem(item) {
    this.items.push(item);
  }

  deleteItem(item) {
    this.items = this.items.filter(isNotEqual.bind(null, item));
  }

  editTitle(title) {
    this.title = title;
  }

  updateItem(newItem){
    const itemToUpdate =  this.items.filter(item => item.description == newItem.description);
    const index = this.items.indexOf(itemToUpdate[0]);
    this.items[index] = newItem
  }
}

const isNotEqual = function(first, second) {
  const comparisons = Object.keys(first).filter(
    key => first[key] == second[key]
  );
  return comparisons.length != 2;
};

module.exports = List;
