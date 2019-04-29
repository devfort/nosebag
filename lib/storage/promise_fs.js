const fs = require('fs');

function handler(resolve, reject) {
  return (error, value) => {
    if (error)
      reject(error);
    else
      resolve(value);
  };
}

function convert(object, method) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      args.push(handler(resolve, reject));
      object[method](...args);
    });
  }
}

module.exports = {
  readdir:  convert(fs, 'readdir'),
  readFile: convert(fs, 'readFile'),
  stat:     convert(fs, 'stat'),
};
