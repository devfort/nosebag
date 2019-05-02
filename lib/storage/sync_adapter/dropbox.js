const API_ROOT  = 'https://content.dropboxapi.com/2';
const TYPE_JSON = 'application/json';


function get(object, path) {
  return path.reduce((obj, field) => obj[field] || {}, object);
}


class Result {
  constructor(data, meta, error) {
    this.data = data;
    this.meta = meta;
  }
}

class Error {
  constructor(type, message) {
    this.type = type;
    this.message = message;
  }

  isConflict() {
    return this.type === 'conflict';
  }
}


class Dropbox {
  constructor(token) {
    this._token = token;

    this._headers = {
      'Authorization': 'Bearer ' + this._token,
    };
  }

  async read(path) {
    let args = { path };

    let response = await fetch(API_ROOT + '/files/download', {
      method: 'POST',
      mode: 'cors',
      headers: this._build_headers(args)
    });

    return this._handle_response(response);
  }

  add(path, data) {
    return this._upload(path, 'add', data);
  }

  update(path, data, rev) {
    return this._upload(path, { '.tag': 'update', update: rev }, data);
  }

  async _upload(path, mode, data) {
    let args = { path, mode, autorename: false, mute: true };

    let response = await fetch(API_ROOT + '/files/upload', {
      method: 'POST',
      mode: 'cors',
      headers: this._build_headers(args, {
        'Content-Type': 'text/plain; charset=dropbox-cors-hack'
      }),
      body: data
    });

    return this._handle_response(response);
  }

  _build_headers(args, extra = {}) {
    return {
      ...this._headers,
      ...extra,
      'Dropbox-API-Arg': JSON.stringify(args)
    };
  }

  async _handle_response(response) {
    let result  = response.headers.get('Dropbox-API-Result'),
        type    = response.headers.get('Content-Type'),
        is_json = type && type.includes(TYPE_JSON),
        body    = await response.text();

    let meta = is_json ? JSON.parse(body) : JSON.parse(result || '{}');

    if (response.status === 200)
      return new Result(is_json ? null : body, meta);

    if (response.status === 409) {
      if (get(meta, ['error', 'path', '.tag']) === 'not_found')
        return null;

      if (get(meta, ['error', 'reason', 'conflict', '.tag']) === 'file')
        throw new Error('conflict', meta.error_summary);
    }

    if (response.status === 400)
      throw new Error('bad_request', body);

    let tag = get(meta, ['error', '.tag']),
        summary = get(meta, ['error_summary']);

    throw new Error(tag, summary);
  }
}

module.exports = Dropbox;
