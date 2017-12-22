var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('../web/http-helpers');
var fetcher = require('../workers/htmlfetcher');
var _ = require('underscore');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  res.headers = httpHelpers.headers;
  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(error, data) {
       
        if (error) {
          console.log('Cannot get index.html');
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end();
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
        }
      });
    } else {
      fs.readFile(archive.paths.archivedSites + req.url, function(error, data) {
        if (error) {
          console.log('Cannot get index.html');
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end();
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          // serveAss
          res.end(data);
          // };
        }
      });
    }
  }
  if (req.method === 'POST') {
    var body = []; 
    req.on('data', function(data) {
      body.push(data);
    });
    req.on('end', function() {
      body = body.toString().slice(4);
      if (archive.isUrlArchived(body, (exists) => exists)) {
        // Load page
        // serveAssets(body,)
        httpHelpers.serveAssets(res, archive.paths.archivedSites + '/' + req.url, function(data) {
          res.end(data);
        });
      } else {
        archive.addUrlToList(body);
        res.writeHead(302, {'Location': archive.paths.siteAssets + '/loading.html'});

        res.end();
      }
    });
  }
  // archive.readListOfUrls(archive.downloadUrls);
  // res.end(archive.paths.list);
  // fetcher.fetch(); 
};
