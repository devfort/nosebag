const { SyncAdapter, Error } = require('../../lib/storage/sync_adapter'),
      Storage = require('../fake_storage');


function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}


describe('sync adapter', () => {
  beforeEach(() => {
    this.storage = new Storage();
    this.remote  = jasmine.createSpyObj('remote', ['read', 'add', 'update']);
    this.adapter = new SyncAdapter(this.storage, this.remote);
  })

  describe('read_file', () => {
    beforeEach(() => {
      let response = { data: 'hello world', meta: { rev: 'v1' } };
      this.remote.read.withArgs('/file').and.returnValue(Promise.resolve(response));
    });

    describe('with an empty cache', () => {
      it('returns the file from the remote', async () => {
        let response = await this.adapter.read_file('file');
        expect(response).toEqual('hello world');
      })

      it('puts the response in the cache', async () => {
        await this.adapter.read_file('file');
        expect(this.storage.getItem('data:/file')).toEqual('hello world');
      })
    })

    describe('when the remote returns no data', () => {
      beforeEach(() => {
        this.remote.read.withArgs('/file').and.returnValue(Promise.resolve(null));
      })

      it('returns null', async () => {
        let response = await this.adapter.read_file('file');
        expect(response).toEqual(null);
      })

      it('does not write anything to the cache', async () => {
        await this.adapter.read_file('file');
        expect(this.storage.length).toEqual(0);
      })
    })

    describe('when the remote throws an error', () => {
      beforeEach(() => {
        this.remote.read.withArgs('/file').and.returnValue(Promise.reject());
      })

      it('returns null', async () => {
        let response = await this.adapter.read_file('file');
        expect(response).toEqual(null);
      })

      it('does not write anything to the cache', async () => {
        await this.adapter.read_file('file');
        expect(this.storage.length).toEqual(0);
      })
    })

    describe('with a warm cache', () => {
      beforeEach(async () => {
        await this.adapter.read_file('file');

        let response = { data: 'updated', meta: { rev: 'v2' } };
        this.remote.read.withArgs('/file').and.returnValue(Promise.resolve(response));
      })

      it('returns the file from the cache', async () => {
        let response = await this.adapter.read_file('file');
        expect(response).toEqual('hello world');
      })

      it('returns the updated file from the remote on a second call', async () => {
        await this.adapter.read_file('file');
        let response = await this.adapter.read_file('file');
        expect(response).toEqual('updated');
      })
    })
  })

  describe('write_file', () => {
    describe('with an empty cache and nothing in the remote', () => {
      beforeEach(() => {
        let add_response = Promise.resolve({ meta: { rev: 'v1' } });
        this.remote.add.and.returnValue(add_response);
      })

      it('adds a new file to the remote', async () => {
        await this.adapter.write_file('file', 'content');
        await this.adapter.wait_sync();

        expect(this.remote.add).toHaveBeenCalledTimes(1);
        expect(this.remote.add).toHaveBeenCalledWith('/file', 'content');

        expect(this.remote.update).not.toHaveBeenCalled();
      })
    })

    describe('with an empty cache and a file in the remote', () => {
      beforeEach(() => {
        let add_response = Promise.reject(new Error('conflict'));
        this.remote.add.and.returnValue(add_response);

        let read_response = Promise.resolve({ data: 'old content', meta: { rev: 'v2' } });
        this.remote.read.and.returnValue(read_response);

        let update_response = Promise.resolve({ meta: { rev: 'v3' } });
        this.remote.update.and.returnValue(update_response);
      })

      it('updates the file in the remote', async () => {
        await this.adapter.write_file('file', 'new content');
        await this.adapter.wait_sync();

        expect(this.remote.add).toHaveBeenCalledTimes(1);
        expect(this.remote.add).toHaveBeenCalledWith('/file', 'new content');

        expect(this.remote.update).toHaveBeenCalledTimes(1);
        expect(this.remote.update).toHaveBeenCalledWith('/file', 'new content', 'v2');
      })
    })

    describe('when a write occurs while syncing', () => {
      beforeEach(() => {
        let add_response = delay(100, { meta: { rev: 'v1' } });
        this.remote.add.and.returnValue(add_response);

        let update_response = Promise.resolve({ meta: { rev: 'v2' } });
        this.remote.update.and.returnValue(update_response);
      })

      it('completely updates the file in the remote', async () => {
        await this.adapter.write_file('file', 'content');
        await delay(50);
        await this.adapter.write_file('file', 'updated');

        await this.adapter.wait_sync();

        expect(this.remote.add).toHaveBeenCalledTimes(1);
        expect(this.remote.add).toHaveBeenCalledWith('/file', 'content');

        expect(this.remote.update).toHaveBeenCalledTimes(1);
        expect(this.remote.update).toHaveBeenCalledWith('/file', 'updated', 'v1');
      })
    })
  })
})
