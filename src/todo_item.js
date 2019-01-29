class Item {
  constructor(description,status='TODO') {
    this.description = description;
    this.statuses = ["TODO", "Done"];
    this.status = status;
  }

  toggleStatus() {
    this.status = this.statuses
      .filter(status => status != this.status)
      .join("");
  }

  edit(description) {
    this.description = description;
  }
  
}

module.exports = Item;
