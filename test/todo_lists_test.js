const chai = require('chai');
const Item = require('../src/todo_item');
const List = require('../src/todo_list');
const Lists = require('../src/todo_lists');

const item1 = new Item('some text');
const item2 = new Item('some another text');
const item3 = new Item("something else");
const item4 = new Item("read novel");
const item5 = new Item("have lunch");
const item6 = new Item("write test");

const list1 = new List("random", [item1, item2, item3]);
const list2 = new List("Office", [item4, item5, item6]);
const todolists = [list1, list2];

const lists = new Lists("Ankon", todolists);

describe("addList", () => {
  it("should give the previous lists if no lists is added", () => {
    const actualOutput = lists.lists;
    const expectedOutput = [list1, list2];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });

  it("should give the new lists if no lists is added", () => {
    const list3 = new List('randomOffice',[item1,item3,item6]);
    lists.addList(list3);
    const actualOutput = lists.lists;
    const expectedOutput = [list1, list2,list3];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
});

describe('deleteList',() => {
  let list3;
  beforeEach(()=>{
    list3 = new List('randomOffice',[item1,item3,item6]);
  });

  it('should give the previous lists if no list is deleted',() => {
    const actualOutput = lists.lists;
    const expectedOutput = [list1, list2, list3];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
  
  it('should give the new lists if one list is deleted',() => {
    lists.deleteList([list3]);
    const actualOutput = lists.lists;
    const expectedOutput = [list1, list2];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
  
  it('should give the new lists if more than one list is deleted',() => {
    lists.deleteList([list1, list2]);
    const actualOutput = lists.lists;
    const expectedOutput = [];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });

});

describe('updateList',() => {
  it('should give the previous list if nothing is updated',() => {
    const actualOutput = lists.lists;
    const expectedOutput = [];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  });
  
  it('should update the list given',()=>{
    lists.addList(list1);
    const listToUpdate = new List("random", [item1, item2, item3, item4]);
    lists.updateList(listToUpdate);
    const actualOutput = lists.lists;
    const expectedOutput = [listToUpdate];
    chai.expect(actualOutput).to.be.deep.equal(expectedOutput);
  })

});
