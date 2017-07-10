//https://developer.atlassian.com/static/rest/bitbucket-server/5.0.1/bitbucket-git-rest.html#idm45907350621008
var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Tags', function () {
  var requestGet, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function () {
    bitbucketClient = new BitbucketClient('http://localhost/', oauth);
    requestPost = sinon.stub(request, 'post');
  });

  afterEach(function () {
    request.post.restore();
  });

  it('should create tag with required arguments', function (done) {
    var expected = require('../mocks/tags-post.json');
    requestPost.returns(Promise.resolve(expected));

    var tagName = 'release-tag';
    var force = 'true';
    var message = "A new release tag";
    var startPoint = "refs/heads/feature-branch";
    var tagType = "ANNOTATED";

    bitbucketClient.tags.post('PRJ', 'my-repo', tagName, startPoint)
      .then(function (response) {
        assert.equal(expected, response);
        var requestBody = {
            name: tagName,
            startPoint: startPoint
        };
        var calledWith = requestPost.calledWith( sinon.match.has('body', requestBody) )
        assert.ok(calledWith, 'did not get expected request body');
        done();
      });
  });

});
