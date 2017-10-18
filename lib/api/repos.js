'use strict';

const BaseResource = require('./resource')
const {
  async,
  utils,
  Promise,
  _
} = require('../util')

function createRepos(client, opts = {}) {
  return new Repos(client, opts)
}

const {
  createProjects
} = require('./projects')

class Repos extends BaseResource {
  constructor(client, opts = {}) {
    super(client, opts)
    this.projects = createProjects(client);
    this.allRepos = [];
  }

  get(projectKey, options) {
    this.log('get', {
      projectKey,
      options
    })
    let uri = 'projects/' + projectKey + '/repos'
    return this.client.getCollection(uri, options);
  }

  getAll(options) {
    this.log('getAll', {
      options
    })
    var self = this;
    options = options || {};
    let {
      allRepos
    } = this

    return this.client.getCollection('repos', options)
      .then(function (repos) {
        allRepos = _.concat(allRepos, repos.values);

        if (!repos.isLastPage) {
          // Keep previous call's args
          options.args = options.args || {};

          // Append 'start' arg
          options.args.start = repos.nextPageStart;

          return self.getAll(options);
        }
      })
      .then(function () {
        return allRepos;
      });
  }

  getRepo(projectKey, repo, options) {
    this.log('getRepo', {
      projectKey,
      repo,
      options
    })
    let uri = 'projects/' + projectKey + '/repos/' + repo
    return this.client.get(uri, options);
  }

  browse(projectKey, repo, options) {
    this.log('browse', {
      projectKey,
      repo,
      options
    })
    options = options || {};

    var uriPath = 'projects/' + projectKey + '/repos/' + repo + '/browse';
    if (options.path) {
      // add first slash, if missing
      if (_.first(options.path) !== '/') {
        options.path = '/' + options.path;
      }

      uriPath += options.path;
    }

    return this.client.getCollection(uriPath, options);
  }

  getCombined(projectKey, options) {
    this.log('getCombined', {
      projectKey,
      options
    })

    if (projectKey) {
      return this.get(projectKey, options);
    } else {
      // For each project, get all repos.
      var reposCombined = [];

      var API = this;
      let {
        projects
      } = this

      return new Promise(function (resolve, reject) {
        // Get all projects.
        projects.get().then(function (projectsResponse) {
          // Async, for each project.
          async.forEachOf(projectsResponse.values, function (project, index, callback) {
            // Get project repos.
            API.get(project.key).then(function (repoResponse) {
              // Merge to result.
              reposCombined = utils(reposCombined).concat(repoResponse.values).value();
              callback();
            }).catch(function (err) {
              callback(err);
            });
          }, function (err) { // all repos resolved.
            if (err) {
              reject(err);
            } else {
              resolve({
                values: reposCombined
              });
            }
          });
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  }
}


module.exports = {
  createRepos,
  Repos
}
