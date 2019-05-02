class Storage {
  constructor() {
    this.clear();
  }

  getItem(name) {
    return this._items.get(name);
  }

  setItem(name, value) {
    if (!this._items.has(name)) this.length += 1;
    this._items.set(name, String(value));
  }

  clear() {
    this._items = new Map();
    this.length = 0;
  }
}

module.exports = Storage;
