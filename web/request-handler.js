var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('../web/http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    console.log(req.url);
    if (req.url === '/') {
      fs.readFile(__dirname + '/public/index.html', function(error, data) {
        if (error) {
          console.log('Cannot get index.html');
          res.writeHead(404, {'Content-Type': 'text/plain'});
          res.end(data);
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
          res.end(data);
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data);
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
        // httpHelpers.serveAssets(body);
      } else {
        archive.addUrlToList(body);
        res.writeHead(302, {'Content-Type': 'text/html'});
        res.end(body);
      }
    });
  }
  // archive.readListOfUrls(archive.downloadUrls);
  // res.end(archive.paths.list);
};
