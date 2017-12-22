var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('../web/http-helpers');
var fetcher = require('../workers/htmlfetcher');
var _ = require('underscore');
var request = require('request');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  res.headers = httpHelpers.headers;

  if (req.method === 'GET') {
    console.log(req.url, ' is the url');
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
    } else if (req.url === '/loading.html') {
      fs.readFile(archive.paths.siteAssets + '/loading.html', function(error, data) {
       
        if (error) {
          console.log('Cannot get index.html');
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end();
        } else {
          if (req.url.includes('.css')) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
          } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
          } 
        }
      });
    } else {
      httpHelpers.serveAssets(res, archive.paths.archivedSites + req.url, function(data) {
        archive.isUrlArchived(req.url, (exists) => {
          // console.log(data.toString());
          if (exists) {
            res.writeHead(200, {'Content-Type': 'text.html'});
            res.end(data);
          } else {
            console.log('hi');
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end();
          }
        });
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
      archive.isUrlArchived(body, (exists) => { 
        if (exists) {
          res.writeHead(302, {'Location': '/' + body});
          res.end();
        } else {
          archive.addUrlToList(body);
          res.writeHead(302, {'Location': '/loading.html'});
          res.end();
        }
      });
    });
  }
  fetcher.fetch(); 
};
