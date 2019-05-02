class Cache {
  constructor(storage) {
    this._storage = storage;
  }

  read(name) {
    return this._storage.getItem('data:' + name);
  }

  put(name, response) {
    if (!response.data) return;
    this._storage.setItem('data:' + name, response.data);
  }
}

module.exports = Cache;
