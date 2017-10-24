/* jshint node:true, eqnull:true */

'use strict';

var path       = require('path');
var getGitInfo = require('git-repo-info');

module.exports = function version(shaLength, root) {
  var projectPath = root || process.cwd();
  var packageVersion = require(path.join(projectPath, 'package.json')).version;
  var info = getGitInfo(projectPath);

  if (info.tag) {
    if (packageVersion && info.tag.indexOf(packageVersion) !== -1) {
      return packageVersion;
    } else {
      return info.tag;
    }
  }

  var sha = info.sha || process.env.HEROKU_SLUG_COMMIT || '';
  var prefix;

  if (packageVersion != null) {
    prefix = packageVersion.replace(/^v/, '');
  } else if (info.branch) {
    prefix = info.branch;
  } else {
    prefix = 'DETACHED_HEAD';
  }

  return prefix + '-' + process.env.HEROKU_RELEASE_VERSION + '+' + sha.slice(0, shaLength || 8);
};
