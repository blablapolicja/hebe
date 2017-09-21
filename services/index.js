const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const pathToDir = path.join(__dirname, '..');
const privateKey = fs.readFileSync(`${pathToDir}/certificates/server.key`, 'utf8');
const certificate = fs.readFileSync(`${pathToDir}/certificates/server.crt`, 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
};
const app = express();
const HTTP_PORT = 8080;
const HTTPS_PORT = 8081;
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.get('/', (req, res) => res.send('HEBE says Hi'));

app.get('/webhook/', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'verify_my_hebe_bot') {
    return res.send(req.query['hub.challenge']);
  }

  res.send('Error, wrong token');
});

httpServer.listen(HTTP_PORT, () => console.log(`Listen http on ${HTTP_PORT}`));
httpsServer.listen(HTTPS_PORT, () => console.log(`Listen https on ${HTTPS_PORT}`));
