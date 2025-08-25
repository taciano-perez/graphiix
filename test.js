const assert = require('assert');

class Element {
  constructor() {
    this.children = [];
    this.eventListeners = {};
    this.classList = {
      classes: new Set(),
      add: function(cls){this.classes.add(cls);},
      toggle: function(cls){
        if (this.classes.has(cls)) {
          this.classes.delete(cls);
        } else {
          this.classes.add(cls);
        }
      },
      contains: function(cls){return this.classes.has(cls);}
    };
  }
  appendChild(child){
    this.children.push(child);
  }
  addEventListener(event, cb){
    this.eventListeners[event] = cb;
  }
  click(){
    if (this.eventListeners['click']){
      this.eventListeners['click']();
    }
  }
}

const grid = new Element();
grid.id = 'grid';

const documentStub = {
  eventListeners: {},
  addEventListener(event, cb){
    this.eventListeners[event] = cb;
  },
  dispatchEvent(event){
    if (this.eventListeners[event]){
      this.eventListeners[event]();
    }
  },
  getElementById(id){
    return id === 'grid' ? grid : null;
  },
  createElement(tag){
    return new Element();
  }
};

global.document = documentStub;

require('./script.js');

document.dispatchEvent('DOMContentLoaded');

assert.strictEqual(grid.children.length, 64, 'should create 64 cells');

const cell = grid.children[0];
cell.click();
assert(cell.classList.contains('active'), 'cell should be active after first click');
cell.click();
assert(!cell.classList.contains('active'), 'cell should not be active after second click');

console.log('All tests passed');
