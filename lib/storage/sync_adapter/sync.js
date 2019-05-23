class Sync {
  constructor(cache, remote) {
    this._cache   = cache;
    this._remote  = remote;
    this._pending = new Set();
    this._syncing = new Set();
  }

  wait() {
    if (this._pending.size === 0) return Promise.resolve();
    if (this._waiting) return this._waiting.promise;

    this._waiting = {};

    this._waiting.promise = new Promise((resolve, reject) => {
      Object.assign(this._waiting, { resolve, reject });
    });

    return this._waiting.promise;
  }

  _drop_pending(name) {
    this._pending.delete(name);
    if (this._pending.size > 0) return;

    if (!this._waiting) return;

    let { resolve } = this._waiting;
    delete this._waiting;
    resolve();
  }

  process(name) {
    this._pending.add(name);
    this._sync(name);
  }

  async refresh(name) {
    try {
      let response = await this._remote.read(name);
      this._cache.put(name, response);
      return response.data || null;
    } catch (e) {
      return null;
    }
  }

  async _sync(name) {
    if (this._syncing.has(name)) return;
    this._syncing.add(name);

    let record = this._cache.get_record(name),
        { data, rev } = record;

    let retry = () => setTimeout(() => this._sync(name), 1000);

    try {
      let response = rev
          ? await this._remote.update(name, data, rev)
          : await this._remote.add(name, data);

      if (this._cache.resolve(name, record, response)) {
        this._drop_pending(name);
      } else {
        retry();
      }
    } catch (error) {
      if (error.type === 'conflict') await this.refresh(name);
      retry();
    } finally {
      this._syncing.delete(name);
    }
  }
}

module.exports = Sync;
