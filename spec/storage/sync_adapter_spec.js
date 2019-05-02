const { SyncAdapter } = require('../../lib/storage/sync_adapter'),
      Storage = require('../fake_storage');


describe('sync adapter', () => {
  beforeEach(() => {
    this.storage = new Storage();
    this.remote  = jasmine.createSpyObj('remote', ['read']);
    this.adapter = new SyncAdapter(this.storage, this.remote);
  })

  describe('read_file', () => {
    beforeEach(() => {
      let response = { data: 'hello world' };
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

        let response = { data: 'updated' };
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
})
