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

    let result = response.headers.get('Dropbox-API-Result'),
        meta   = JSON.parse(result || '{}'),
        type   = response.headers.get('Content-Type'),
        data   = await response.text(),
        json   = null;

    if (type && type.includes(TYPE_JSON)) json = JSON.parse(data);

    if (response.status === 200)
      return new Result(data, meta);

    if (response.status === 409 && get(json, ['error', 'path', '.tag']) === 'not_found')
      return null;

    if (response.status === 400)
      throw new Error('bad_request', data);

    let tag = get(json, ['error', '.tag']),
        summary = get(json, ['error_summary']);

    throw new Error(tag, summary);
  }

  _build_headers(args, extra = {}) {
    return {
      ...this._headers,
      ...extra,
      'Dropbox-API-Arg': JSON.stringify(args)
    };
  }
}

module.exports = Dropbox;
