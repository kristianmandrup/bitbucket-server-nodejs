'use strict';

const BaseResource = require('./resource')

function createBranches(client, opts = {}) {
  return new Branches(client, opts)
}

class Branches extends BaseResource {
  constructor(client, opts = {}) {
    super(client, opts)
  }

  get(projectKey, repoKey, options) {
    let uri = 'Branches/' + projectKey + '/repos/' + repoKey + '/branches'
    return this.client.getCollection(uri, options);
  }
}

module.exports = {
  createBranches,
  Branches
}
