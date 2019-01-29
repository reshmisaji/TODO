class Lists {
  constructor(userName, lists) {
    this.userName = userName;
    this.lists = lists;
  }

  addList(list) {
    this.lists.push(list);
  }

  deleteList(lists) {
    this.lists = this.lists.filter(isNotEqual.bind(null, lists));
  }

  updateList(newList) {
    const listToUpdate = this.lists.filter(list => list.title == newList.title);
    const index = this.lists.indexOf(listToUpdate[0]);
    this.lists[index] = newList;
  }
}

const isNotEqual = function(first, second) {
  return first.title != second.title;
};

module.exports = Lists;
