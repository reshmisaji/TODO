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
}

const isNotEqual = function(first, second) {
  const comparisons = Object.keys(first).filter(
    key => first[key] == second[key]
  );
  return comparisons.length != 2;
};

module.exports = List;
