const Cache = require('./cache'),
      Sync  = require('./sync');

class SyncAdapter {
  constructor(storage, remote) {
    this._cache  = new Cache(storage);
    this._remote = remote;
    this._sync   = new Sync(this._cache, remote);
  }

  async read_file(name) {
    name = this._normalise(name);

    let cached  = this._cache.read(name),
        fetched = this._sync.refresh(name);

    return cached || await fetched;
  }

  async write_file(name, data) {
    name = this._normalise(name);

    this._cache.write(name, data);
    this._sync.process(name);
  }

  wait_sync() {
    return this._sync.wait();
  }

  _normalise(name) {
    return name.replace(/^\/?/, '/');
  }
}

module.exports = SyncAdapter;
