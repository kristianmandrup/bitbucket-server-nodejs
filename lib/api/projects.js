'use strict';

const BaseResource = require('./resource')

function createProjects(client, opts = {}) {
  return new Projects(client, opts)
}

class Projects extends BaseResource {
  constructor(client, opts = {}) {
    super(client, opts)
  }

  get(options) {
    return this.client.getCollection('projects', options);
  }
}

module.exports = {
  createProjects,
  Projects
}
