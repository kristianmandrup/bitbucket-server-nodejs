var async = require('async');
var utils = require('lodash');
var Promise = require('bluebird');
var _ = require('lodash');


function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Logger {
  constructor(label, opts = {}) {
    if (typeof label !== 'string') {
      opts = label
      label = this.constructor.name
    }
    if (typeof opts !== 'object') {
      this.error('Logger takes an options object as 2nd argument')
    }
    this.label = label
    this.opts = opts
    this.logging = opts.logging
  }

  throw (msg, reason) {
    this.error(msg, reason)
    throw new Error(msg)
  }

  log(...msgs) {
    if (this.logging) {
      console.log(this.label, ...msgs)
    }
  }

  error(...msgs) {
    if (this.logging) {
      console.error(this.label, ...msgs)
    }
  }
}

module.exports = {
  capitalize,
  async,
  utils,
  Promise,
  _,
  Logger
}
