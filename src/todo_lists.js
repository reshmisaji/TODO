class Lists {
  constructor(userName, lists) {
    this.userName = userName;
    this.lists = lists;
  }

  addList(list) {
    this.lists.push(list);
  }

  deleteList(lists) {
    lists.map(list => {
      const index = this.lists.indexOf(list);
      this.lists.splice(index, 1);
    });
  }

  updateList(newList) {
    const listToUpdate = this.lists.filter(list => list.title == newList.title);
    const index = this.lists.indexOf(listToUpdate[0]);
    this.lists[index] = newList;
  }
}

module.exports = Lists;
