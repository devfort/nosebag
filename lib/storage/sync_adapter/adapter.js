const Cache = require('./cache');

class SyncAdapter {
  constructor(storage, remote) {
    this._cache  = new Cache(storage);
    this._remote = remote;
  }

  async read_file(name) {
    name = this._normalise(name);

    let cached  = this._cache.read(name),
        fetched = this._refresh(name);

    return cached || await fetched;
  }

  async _refresh(name) {
    try {
      let response = await this._remote.read(name);
      this._cache.put(name, response);
      return response.data || null;
    } catch (e) {
      return null;
    }
  }

  _normalise(name) {
    return name.replace(/^\/?/, '/');
  }
}

module.exports = SyncAdapter;
