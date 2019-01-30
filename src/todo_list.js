class List {
  constructor(title, items, currentId=0) {
    this.title = title;
    this.currentId = currentId;
    this.items = this.addId(items);
  }

  addId(items){
    items.forEach(item => {
      item.id = this.currentId;
      this.currentId++;
    });
    return items;
  }

  addItem(item) {
    const [itemWithId] = this.addId([item]);
    this.items.push(itemWithId);
  }

  deleteItem(itemId) {
    this.items = this.items.filter(item => item.id!= itemId);
  }

  editTitle(title) {
    this.title = title;
  }

  updateItem(newItem,description){
    const itemToUpdate =  this.items.filter(item => item.description == description);
    const index = this.items.indexOf(itemToUpdate[0]);
    this.items[index] = newItem;
  }
}

const isNotEqual = function(first, second) {
  const comparisons = Object.keys(first).filter(
    key => first[key] == second[key]
  );
  return comparisons.length != 2;
};

module.exports = List;
