const item1 = new Item('Talk to Jaynath');
const item2 = new Item('Have breakfast');
const todoItems = [item1, item2];

const list = new List("Office", todoItems);

describe('addItem',() => {
  it('should give the previos items if nothing is added',() => {
    const currentItems = [item1, item2];
    chai.expect(list.items).to.be.deep.equal(currentItems);
  });

  it('should add an item to the list',()=>{
    const item3 = new Item('Write tests');
    list.addItem(item3);
    const currentItems = [item1, item2, item3];
    chai.expect(list.items).to.be.deep.equal(currentItems);
  })
});

describe('deleteItem',() => {
  let item3;
  beforeEach(()=>{
    item3 = new Item('Write tests');
  })
  it('should give the previous items if nothing is deleted',() =>{
    const currentItems = [item1, item2, item3];
    chai.expect(list.items).to.be.deep.equal(currentItems);
  })

  it('should delete the given item from the list',()=>{
    const items = [item1];
    list.deleteItems(items);
    const currentItems = [item2,item3];
    chai.expect(list.items).to.be.deep.equal(currentItems);
  })

  it('should delete the list of given items from the list',() => {
    const items = [item2, item3];
    list.deleteItems(items);
    const currentItems = [];
    chai.expect(list.items).to.be.deep.equal(currentItems);
  })
})

describe('editTitle',()=>{
  it('should give the title as it is if nothing is changed',()=>{
    const currentTitle = 'Office';
    chai.expect(list.title).to.be.equal(currentTitle);
  })

  it('should give the new title if title is changed',()=>{
    const currentTitle = 'Morning';
    const title = 'Morning';
    list.editTitle(title);
    chai.expect(list.title).to.be.equal(currentTitle);
  })
})
