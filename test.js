const assert = require('assert');

class Element {
  constructor() {
    this.children = [];
    this.eventListeners = {};
    this.value = '';
    this.files = [];
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
      contains: function(cls){return this.classes.has(cls);},
      remove: function(cls){this.classes.delete(cls);}
    };
  }
  appendChild(child){
    this.children.push(child);
  }
  addEventListener(event, cb){
    this.eventListeners[event] = cb;
  }
  trigger(event, arg){
    if (this.eventListeners[event]){
      this.eventListeners[event](arg);
    }
  }
  click(){
    this.trigger('click');
  }
}

const grid = new Element();
grid.id = 'grid';
const generateButton = new Element();
generateButton.id = 'generate';
const bitPattern = new Element();
bitPattern.id = 'bitPattern';
const clearButton = new Element();
clearButton.id = 'clear';
const invertedPattern = new Element();
invertedPattern.id = 'invertedPattern';
const hexPattern = new Element();
hexPattern.id = 'hexPattern';
const saveButton = new Element();
saveButton.id = 'save';
const loadButton = new Element();
loadButton.id = 'load';
const fileInput = new Element();
fileInput.id = 'fileInput';

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
    if (id === 'clear') return clearButton;
    if (id === 'invertedPattern') return invertedPattern;
    if (id === 'hexPattern') return hexPattern;
    if (id === 'save') return saveButton;
    if (id === 'load') return loadButton;
    if (id === 'fileInput') return fileInput;
    return null;
  },
  createElement(tag){
    return new Element();
  }
};

global.document = documentStub;
global.URL = {
  createObjectURL: () => 'blob:mock',
  revokeObjectURL: () => {}
};

class MockFileReader {
  readAsText(file){
    if (this.onload){
      this.onload({ target: { result: file.content } });
    }
  }
}
global.FileReader = MockFileReader;

require('./script.js');

document.dispatchEvent('DOMContentLoaded');

assert.strictEqual(grid.children.length, 56, 'should create 56 cells');

const cell = grid.children[0];
cell.click();
assert(cell.classList.contains('active'), 'cell should be active after first click');
cell.click();
assert(!cell.classList.contains('active'), 'cell should not be active after second click');

// test bit pattern generation
cell.click(); // activate first cell again
generateButton.click();
const expectedPattern = '01000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000';
assert.strictEqual(bitPattern.value, expectedPattern, 'bit pattern should reflect grid state');
const expectedInverted = '00000010\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000';
assert.strictEqual(invertedPattern.value, expectedInverted, 'inverted pattern should mirror bit pattern');
const expectedHex = '$02\n$00\n$00\n$00\n$00\n$00\n$00\n$00';
assert.strictEqual(hexPattern.value, expectedHex, 'hex pattern should reflect inverted pattern');

// test inversion on manual input
bitPattern.value = '00000001';
bitPattern.trigger('input');
assert.strictEqual(invertedPattern.value, '10000000', 'inverted pattern should update on input');
assert.strictEqual(hexPattern.value, '$80', 'hex pattern should update on input');

// test clear functionality
clearButton.click();
assert(grid.children.every(c => !c.classList.contains('active')), 'all cells should be inactive after clear');
assert.strictEqual(bitPattern.value, '', 'bit pattern should be cleared');
assert.strictEqual(invertedPattern.value, '', 'inverted pattern should be cleared');
assert.strictEqual(hexPattern.value, '', 'hex pattern should be cleared');

// test save functionality
cell.click();
saveButton.click();
assert.strictEqual(bitPattern.value, expectedPattern, 'save should generate bit pattern before downloading');

// test load functionality
const loadPattern = '00100000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000';
const loadInverted = '00000100\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000';
const loadHex = '$04\n$00\n$00\n$00\n$00\n$00\n$00\n$00';
fileInput.files = [{ content: loadPattern }];
fileInput.trigger('change', { target: fileInput });
assert(grid.children[1].classList.contains('active'), 'grid should reflect loaded pattern');
assert.strictEqual(bitPattern.value, loadPattern, 'bit pattern should match loaded file');
assert.strictEqual(invertedPattern.value, loadInverted, 'inverted pattern should update after load');
assert.strictEqual(hexPattern.value, loadHex, 'hex pattern should update after load');

console.log('All tests passed');
