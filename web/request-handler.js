var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    console.log(req.url);
    if (req.url === '/') {
      fs.readFile(__dirname + '/public/index.html', function(error, data) {
        if (error) {
          console.log('Cannot get index.html');
          // res.writeHead(404, {'Content-Type': 'text/plain'});
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
      if (archive.isUrlArchived(body)) {
        // Load page
      } else {
        archive.addUrlToList(body);
        res.writeHead(302, {'Content-Type': 'text/html'});
        res.end(body);
      }
    });
  }
  // res.end(archive.paths.list);
};
