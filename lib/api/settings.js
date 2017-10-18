'use strict';

const BaseResource = require('./resource')

function createSettings(client, opts = {}) {
  return new Settings(client, opts)
}

class Settings extends BaseResource {
  constructor(client, opts = {}) {
    super(client, opts)
  }

  get(userSlug, options) {
    let uri = 'users/' + userSlug + '/settings'
    return this.client.get(uri, options);
  }
}

module.exports = {
  createSettings,
  Settings
}
