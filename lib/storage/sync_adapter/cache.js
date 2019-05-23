const DIRTY = '_dirty';

class Cache {
  constructor(storage) {
    this._storage = storage;
    this._load_dirty();
  }

  read(name) {
    return this._storage.getItem('data:' + name);
  }

  write(name, data) {
    this._storage.setItem('data:' + name, data);
    this._mark_dirty(name);
  }

  get_record(name) {
    let data = this._storage.getItem('data:' + name);
    if (data === null) return null;

    let meta = this._storage.getItem('meta:' + name),
        { rev } = JSON.parse(meta || '{}');

    let counter = this._dirty.get(name);

    return { data, rev, counter };
  }

  put(name, response) {
    if (!response.data) return;

    this._storage.setItem('base:' + name, response.data);
    this._store_rev(name, response);

    if (!this._dirty.has(name)) {
      this._storage.setItem('data:' + name, response.data);
    }
  }

  resolve(name, record, response) {
    this._store_rev(name, response);
    return this._mark_clean(name, record);
  }

  _store_rev(name, response) {
    this._update('meta:' + name, (meta) => meta.rev = response.meta.rev);
  }

  _update(key, transform) {
    let data  = this._storage.getItem(key),
        value = JSON.parse(data || '{}');

    transform(value);

    this._storage.setItem(key, JSON.stringify(value));
  }

  _load_dirty() {
    let data = this._storage.getItem(DIRTY);
    this._dirty = new Map(JSON.parse(data || '[]'));
  }

  _write_dirty() {
    this._storage.setItem(DIRTY, JSON.stringify([...this._dirty]));
  }

  _mark_dirty(name) {
    let counter = this._dirty.get(name) || 0;
    this._dirty.set(name, counter + 1);
    this._write_dirty();
  }

  _mark_clean(name, record) {
    let counter = this._dirty.get(name);
    if (counter !== record.counter) return false;

    this._dirty.delete(name);
    this._write_dirty();

    return true;
  }
}

module.exports = Cache;
