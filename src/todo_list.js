class List {
  constructor(title, items) {
    this.title = title;
    this.items = items;
  }

  addItem(item) {
    this.items.push(item);
  }

  deleteItems(items) {
    items.map(item => {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
    });
  }

  editTitle(title){
    this.title = title;
  }
}

module.exports = List;
