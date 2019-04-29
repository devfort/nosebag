const fs = require('fs');

function handler(resolve, reject) {
  return (error, value) => {
    if (error)
      reject(error);
    else
      resolve(value);
  };
}

function readdir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, handler(resolve, reject));
  });
}

function stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, handler(resolve, reject));
  });
}

module.exports = {
  readdir,
  stat,
};
