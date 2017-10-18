'use strict';

const BaseResource = require('./resource')
const {
  async,
  utils,
  Promise
} = require('../util')

function createPrs(client, opts = {}) {
  return new Prs(client, opts)
}

const {
  createRepos
} = require('./repos')

class Prs extends BaseResource {
  constructor(client, opts = {}) {
    super(client, opts)
    this.repos = createRepos(client, opts);
  }

  get(projectKey, repo, options) {
    if (!options) {
      options = {};
    }

    var clientOptions = {
      args: {
        'state': options.state || 'OPEN'
      }
    };
    var path = 'projects/' + projectKey + '/repos/' + repo + '/pull-requests';

    return this.client.getCollection(path, clientOptions).then(function (response) {
      // filter by author.
      if (options.author) {
        response.values = response.values.filter(filterByAuthor(options.author));
      }
      if (!utils.isUndefined(options.fork)) {
        response.values = response.values.filter(filterByFork(options.fork));
      }
      return response;
    });
  }

  getCombined(projectKey, repo, options) {
    let {
      repos
    } = this
    if (projectKey && repo) {
      return this.get(projectKey, repo, options);
    } else {

      var prsCombined = [];
      var API = this;

      // Find all repos matching projectKey/repo & return all PRs for each.
      return new Promise(function (resolve, reject) {
        // Find all repos.
        repos.getCombined(projectKey).then(function (reposResponse) {
          // Async loop.
          async.forEachOf(reposResponse.values, function (repo, index, callback) {
            API.get(repo.project.key, repo.slug, options).then(function (prResponse) {
              prsCombined = utils(prsCombined).concat(prResponse.values).value();
              callback();
            }).catch(function (err) {
              callback(err);
            });

          }, function (err) { // all PRs resolved.
            if (err) {
              reject(err);
            } else {
              resolve({
                values: prsCombined
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
  createPrs,
  Prs
}

// utility functions

function filterByAuthor(author) {
  return function (pr) {
    return !author || author === pr.author.user.name;
  };
}

function filterByFork(fork) {
  return function (pr) {
    var from = pr.fromRef.repository.project.key + '/' + pr.fromRef.repository.slug;
    var to = pr.toRef.repository.project.key + '/' + pr.toRef.repository.slug;
    return (fork) ? from !== to : from === to;
  }
}
