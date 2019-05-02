class Headers {
  constructor(values) {
    this._values = {};
    for (let key in values) {
      this._values[key.toLowerCase()] = values[key];
    }
  }

  get(key) {
    return this._values[key.toLowerCase()];
  }
}

class Response {
  constructor(status, headers, body) {
    this.status  = status;
    this.headers = new Headers(headers);
    this._body   = body;
  }

  text() {
    return Promise.resolve(this._body);
  }

  json() {
    return Promise.resolve(JSON.parse(this._body));
  }
}

module.exports = Response;
