var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var https = require('https');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
  // index: path.join(__dirname, '../public/index.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf-8', function(error, data) {
    if (error) {
      console.log('Cannot get url list');
    }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urlList) {
    callback(urlList.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(error) {
    if (error) {
      console.log('Cannot add url');
    }
    if (callback) {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites + '/' + url, function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(urls) { //done on a cron cycle
  // exports.readListOfUrls()
  _.each(urls, function(url) {
  // http get url
    if (url.length > 0) {
      http.get('http://' + url, function(res) {
        var body = [];
        res.on('data', (chunk) => {
          body.push(chunk);
        });
        res.on('error', () => {
          console.log('Cannot download URL');
        });
        res.on('end', () => {
          fs.writeFile(exports.paths.archivedSites + '/' + url, body);
        });
      });
    }
  });
  fs.truncate(exports.paths.list, 0);
};
