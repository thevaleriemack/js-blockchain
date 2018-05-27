const http = require('http');
const fs = require('fs');
const parser = require('url');

const router = require('./util/router');

const hostname = 'localhost';
const port = '3000';

const staticPath = (filename) => __dirname + "/public/" + filename

router.register('/', (req, res) => {
  router.render(req, res, staticPath('index.html'));
});

router.register('/demo', (req, res) => {
  router.render(req, res, staticPath('popchain.html'));
});

router.register('/js/bundle.js', (req, res) => {
  router.render(req, res, staticPath('js/bundle.js'));
});

router.register('/css/style.css', (req, res) => {
  router.render(req, res, staticPath('css/style.css'));
});

const server = http.createServer((req, res) => {
  handler = router.route(req);
  handler.process(req, res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
