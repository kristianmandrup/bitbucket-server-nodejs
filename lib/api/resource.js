const {
  Logger
} = require('../util')

module.exports = class BaseResource extends Logger {
  constructor(client, opts = {}) {
    super(opts)
    this.client = client
  }
}
