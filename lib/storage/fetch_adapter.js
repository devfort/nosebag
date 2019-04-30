class FetchAdapter {
  constructor(root) {
    this._root = root;
  }

  async read_file(name) {
    let url = this._root.replace(/\/?$/, '/') + name,
        response = await fetch(url),
        text = await response.text();

    return text;
  }
}

module.exports = FetchAdapter;
