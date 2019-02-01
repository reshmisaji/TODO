class Lists {
  constructor(lists, currentId = 0) {
    this.currentId = currentId;
    this.lists = this.addId(lists);
  }

  addId(lists){
    lists.forEach(list => {
      list.id = this.currentId;
      this.currentId++;
    });
    return lists;
  }

  addList(list) {
    const [listWithId] = this.addId([list]);
    this.lists.push(listWithId);
  }

  deleteList(listToDelete) {
    this.lists = this.lists.filter(list => list.id != listToDelete.id);
  }

  updateList(newList) {
    const listToUpdate = this.lists.filter(list => list.title == newList.title);
    const index = this.lists.indexOf(listToUpdate[0]);
    this.lists[index] = newList;
  }
}

module.exports = Lists;
