'use strict';

const resourceNames = [
  'projects',
  'repos',
  'branches',
  'tags',
  'prs',
  'users',
  'hooks',
  'settings'
]

var qs = require('query-string');
var request = require('request-promise');
var _ = require('lodash');
const {
  capitalize,
  Logger
} = require('./util')
const {
  validateAuth,
  validateOAuth
} = require('./validate')


module.exports = class Client extends Logger {
  constructor(baseUrl, auth, opts = {}) {
    super(opts)
    auth = auth || {};

    // defaults to 'public' auth if none provided
    auth.type = auth.type || 'public';

    // required baseUrl
    if (!baseUrl) {
      throw new Error('Base URL is missing');
    } else {
      // add ending slash if not present
      if (_.last(baseUrl) !== '/') {
        baseUrl += '/';
      }
    }

    // validate basic auth
    if (auth.type === 'basic') {
      var isValidAuthAttribute = validateAuth(auth);
      if (isValidAuthAttribute) {
        this.auth = auth;
      } else {
        this.throw('Auth\'s username and/or password is missing');
      }
    }

    // validate oauth
    if (auth.type === 'oauth') {
      var missingOAuthAttribute = validateOAuth(auth);
      if (missingOAuthAttribute) {
        this.throw(`OAuth's ${missingOAuthAttribute} is missing`)
      } else {
        this.oauth = auth;
      }
    }

    this.baseUrl = baseUrl;

    // Init API.
    this.resourceNames.map(name => {
      this[name] = this.createResourceApi(name)
    })
  }

  get resourceNames() {
    return resourceNames
  }

  createResourceApi(name) {
    const resource = require(`./api/${name}`);
    const className = capitalize(name)
    const factoryMethodName = `create${className}`
    const factoryMethod = resource[factoryMethodName]
    return factoryMethod(this, this.opts)
  }

  getCollection(path, options) {
    this.log('getCollection', {
      path,
      options
    })
    options = options || {};
    options.args = _.defaults(options.args || {}, {
      'limit': 1000
    });
    return this.get(path, options);
  }

  get(path, options) {
    this.log('get', {
      path,
      options
    })

    options = options || {};
    options.args = options.args || {};
    var query = qs.stringify(options.args);
    if (query) {
      query = '?' + query;
    }

    var params = {
      uri: this.baseUrl + path + query,
      auth: this.auth,
      oauth: this.oauth,
      json: true
    };

    this.log('make get request', {
      params
    })
    return request.get(params);
  }

  put(path, data) {
    this.log('put', {
      path,
      data
    })

    var params = {
      uri: this.baseUrl + path,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: this.auth,
      oauth: this.oauth,
      body: data,
      json: true
    };

    this.log('make post request', {
      params
    })
    return request.post(params);
  }
}
