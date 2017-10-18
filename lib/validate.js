var _ = require('lodash');

function validateAuth(auth) {
  return !!(auth.username && auth.password);
}

function validateOAuth(oauth) {
  var attributes = ['consumer_key', 'consumer_secret', 'signature_method', 'token', 'token_secret'];

  for (var i = 0; i < attributes.length; ++i) {
    var attribute = attributes[i];

    if (_.isEmpty(oauth[attribute])) {
      return attribute;
    }
  }
}

module.exports = {
  validateAuth,
  validateOAuth
}
