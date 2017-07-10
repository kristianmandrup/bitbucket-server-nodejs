'use strict';

module.exports = function (client) {

  function buildPath(projectKey, repoKey){
  	return 'projects/' + projectKey + '/repos/' + repoKey + '/tags';
  }

  return {
    get: function (projectKey, repoKey, options) {
      return client.getCollection(buildPath(projectKey, repoKey), options);
    },
    post: function(projectKey, repoKey, tagName, startPoint) {
      return client.put(buildPath(projectKey, repoKey), {
      	name: tagName,
      	startPoint: startPoint
      });
    }
  };
};
