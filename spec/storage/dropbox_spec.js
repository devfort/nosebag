const Dropbox = require('../../lib/storage/sync_adapter/dropbox'),
      Response = require('../fake_response');

const TOKEN = 'my dropbox token';


describe('Dropbox client', () => {
  beforeEach(() => {
    this.client  = new Dropbox(TOKEN);
    global.fetch = jasmine.createSpy();

    let response = new Response(200, {}, 'hello world');
    fetch.and.returnValue(Promise.resolve(response));
  })

  afterEach(() => {
    delete global.fetch;
  })

  describe('read', () => {
    it('makes a request to the download endpoint', async () => {
      await this.client.read('/file.txt');

      expect(fetch).toHaveBeenCalledWith(
        'https://content.dropboxapi.com/2/files/download', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Authorization': 'Bearer ' + TOKEN,
            'Dropbox-API-Arg': '{"path":"/file.txt"}'
          }
        });
    })

    describe('on successful response', () => {
      beforeEach(() => {
        let response = new Response(200, {
            'dropbox-api-result': JSON.stringify({
              name: 'file.txt',
              rev: 'file-revision'})
          },
          'hello world');

        fetch.and.returnValue(Promise.resolve(response));
      })

      it('returns the file contents and version', async () => {
        let response = await this.client.read('/file.txt');

        expect(response.data).toEqual('hello world');
        expect(response.meta).toEqual({ name: 'file.txt', rev: 'file-revision' });
      })
    })

    describe('on an authorization error', () => {
      beforeEach(() => {
        let response = new Response(401, {
            'WWW-Authenticate': 'Bearer realm="Dropbox-API"',
            'Content-Type': 'application/json'
          },
          JSON.stringify({
            error_summary: 'invalid_access_token/',
            error: { '.tag': 'invalid_access_token' }
          }));

        fetch.and.returnValue(Promise.resolve(response));
      })

      it('throws an error', async () => {
        let error;
        try { await this.client.read('/file.txt') } catch (e) { error = e }

        expect(error.type).toEqual('invalid_access_token');
      })
    })

    describe('on a bad request', () => {
      beforeEach(() => {
        let response = new Response(400, { 'Content-Type': 'text/plain' }, 'Boo!');
        fetch.and.returnValue(Promise.resolve(response));
      })

      it('throws an error', async () => {
        let error;
        try { await this.client.read('/file.txt') } catch (e) { error = e }

        expect(error.type).toEqual('bad_request');
        expect(error.message).toEqual('Boo!');
      })
    })

    describe('on a missing file', () => {
      beforeEach(() => {
        let response = new Response(409, {
            'Content-Type': 'application/json'
          },
          JSON.stringify({
            error_summary: 'path/not_found/.',
            error: { '.tag': 'path', path: { '.tag': 'not_found' } }
          }));

        fetch.and.returnValue(Promise.resolve(response));
      })

      it('returns null', async () => {
        let response = await this.client.read('/file.txt');
        expect(response).toEqual(null);
      })
    })
  })
})
