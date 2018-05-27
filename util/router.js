const fs = require('fs');
const parser = require('url');
const handlerFactory = require('./handler');

let handlers = {};

const mimemap = {
  '': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'js': 'text/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'ico': 'image/x-icon',
  'svg': 'image/svg+xml',
  'pdf': 'application/pdf',
  'wav': 'audio/wav',
  'mp3': 'audio/mpeg',
  'doc': 'application/msword'
};

exports.clear = () => { handlers = {} };

exports.register = (url, method) => {
  handlers[url] = handlerFactory.createHandler(method);
}

exports.route = (req) => {
  url = parser.parse(req.url, true);
  let handler = handlers[url.pathname];
  if (!handler) { handler = this.missing(req); }
  return handler;
}

exports.render = (req, res, pathToFile) => {
  data = fs.readFileSync(pathToFile);
  let ext = pathToFile.split('.').pop();
  res.writeHead(200, {'Content-Type': mimemap[ext]});
  res.write(data);
  res.end();
}

exports.missing = (req) => {
  return handlerFactory.createHandler(function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write(":( no route registered for " + url.pathname);
    res.end();
  }); 
}
