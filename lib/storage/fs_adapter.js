const fs = require('fs'),
      path = require('path');


class FSAdapter {
  constructor(root) {
    this._root = root;
  }

  read_file(name) {
    let full_path = path.join(this._root, name);

    return new Promise((resolve, reject) => {
      fs.readFile(full_path, 'utf8', (error, data) => {
        if (error)
          reject(error);
        else
          resolve(data);
      });
    });
  }
}

module.exports = FSAdapter;
