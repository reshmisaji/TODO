class Item {
  constructor(description) {
    this.description = description;
    this.statuses = ["TODO", "Done"];
    this.status = "TODO";
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
