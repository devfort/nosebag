class Error {
  constructor(type, message) {
    this.type = type;
    this.message = message;
  }

  isConflict() {
    return this.type === 'conflict';
  }
}

module.exports = Error;
