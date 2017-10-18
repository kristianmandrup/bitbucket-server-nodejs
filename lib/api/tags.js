'use strict';

function createTags(client, opts = {}) {
  return new Tags(client, opts)
}

const BaseResource = require('./resource')

class Tags extends BaseResource {
  constructor(client, opts = {}) {
    super(client, opts)
  }

  get(projectKey, repoKey, options) {
    let uri = 'projects/' + projectKey + '/repos/' + repoKey + '/tags'
    return this.client.getCollection(uri, options);
  }
}

module.exports = {
  createTags,
  Tags
}
