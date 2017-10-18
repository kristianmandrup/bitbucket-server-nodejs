'use strict';

function createUsers(client, opts = {}) {
  return new Users(client, opts)
}

const BaseResource = require('./resource')

function createUsers(client, opts = {}) {
  return new Users(client, opts)
}

class Users extends BaseResource {
  constructor(client, opts = {}) {
    super(client, opts)
  }
  get(options) {
    return this.client.getCollection('users', options);
  }

  getUser(userSlug, options) {
    let uri = 'users/' + userSlug
    return this.client.get(uri, options);
  }
}

module.exports = {
  createUsers,
  Users
}
