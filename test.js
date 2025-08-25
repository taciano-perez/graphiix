const assert = require('assert');

class Element {
  constructor() {
    this.children = [];
    this.eventListeners = {};
    this.value = '';
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
const generateButton = new Element();
generateButton.id = 'generate';
const bitPattern = new Element();
bitPattern.id = 'bitPattern';

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
    if (id === 'grid') return grid;
    if (id === 'generate') return generateButton;
    if (id === 'bitPattern') return bitPattern;
    return null;
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

// test bit pattern generation
cell.click(); // activate first cell again
generateButton.click();
const expectedPattern = '10000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000';
assert.strictEqual(bitPattern.value, expectedPattern, 'bit pattern should reflect grid state');

console.log('All tests passed');
