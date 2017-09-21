const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = 8080;
const token = process.env.FB_PAGE_ACCESS_TOKEN;


const sendTextMessage = (sender, text) => {
  const messageData = { text };

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: token,
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender,
      },
      message: messageData,
    },
  }, (error, response) => {
    if (error) {
      console.log('Error sending messages: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
};

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

app.post('/webhook/', (req, res) => {
  const messagingEvents = req.body.entry[0].messaging;

  console.log(messagingEvents);
  messagingEvents.map((event) => {
    const sender = event.sender.id;

    if (event.message && event.message.text) {
      const { text } = event.message;

      sendTextMessage(sender, `Text received, echo: ${text.substring(0, 200)}`);
    }

    return null;
  });

  res.sendStatus(200);
});

app.listen(app.get('port'), () => console.log('Listen http on ', app.get('port')));
