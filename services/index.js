const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = 8080;

app.set('port', (process.env.PORT || HTTP_PORT));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('HEBE says Hi'));

app.get('/webhook/', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'verify_my_hebe_bot') {
    return res.send(req.query['hub.challenge']);
  }

  res.send('Error, wrong token');
});

app.listen(app.get('port'), () => console.log('Listen http on ', app.get('port')));
