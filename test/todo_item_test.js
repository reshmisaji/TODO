const item = new Item('this is some text');

describe('toggleStatus',() => {
  it('should show TODO as the status initially',() => {
    chai.expect(item.status).to.be.equal('TODO');
  });

  it('should show done if toggleStatus is called once',()=>{
    item.toggleStatus();
    chai.expect(item.status).to.be.equal('Done');
  });

  it('should show the same status if toggleStatus is called twice',()=>{
    item.toggleStatus();
    item.toggleStatus();
    chai.expect(item.status).to.be.equal('Done');
  })
});

describe('edit',() => {
  it('should give the previous description if nothing changes',() => {
    const description = 'this is some text';
    chai.expect(item.description).to.be.equal(description);
  });

  it('should give the new description if description is changed',()=>{
    const description = 'something';
    item.edit(description);
    chai.expect(item.description).to.be.equal(description);
  })
});