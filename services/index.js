const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = 8080;
const token = process.env.FB_PAGE_ACCESS_TOKEN;


// const sendTextMessage = (sender, text) => {
//   const messageData = { text };
//
//   request({
//     url: 'https://graph.facebook.com/v2.6/me/messages',
//     qs: {
//       access_token: token,
//     },
//     method: 'POST',
//     json: {
//       recipient: {
//         id: sender,
//       },
//       message: messageData,
//     },
//   }, (error, response) => {
//     if (error) {
//       console.log('Error sending messages: ', error);
//     } else if (response.body.error) {
//       console.log('Error: ', response.body.error);
//     }
//   });
// };

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

// app.post('/webhook/', (req, res) => {
//   const messagingEvents = req.body.entry[0].messaging;
//
//   console.log(messagingEvents);
//   messagingEvents.map((event) => {
//     const sender = event.sender.id;
//
//     if (event.message && event.message.text) {
//       const { text } = event.message;
//
//       sendTextMessage(sender, `Text received, echo: ${text.substring(0, 200)}`);
//     }
//
//     return null;
//   });
//
//   res.sendStatus(200);
// });

// app.post('/webhook/', function (req, res) {
//   let messaging_events = req.body.entry[0].messaging;
//
//   process.stdout.write(messaging_events);
//
//   for (let i = 0; i < messaging_events.length; i++) {
//     let event = req.body.entry[0].messaging[i];
//     let sender = event.sender.id;
//     if (event.message && event.message.text) {
//       let text = event.message.text
//       sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
//     }
//   }
//   res.sendStatus(200)
// });
//
// function sendTextMessage(sender, text) {
//   let messageData = { text:text };
//   request({
//     url: 'https://graph.facebook.com/v2.6/me/messages',
//     qs: {access_token:token},
//     method: 'POST',
//     json: {
//       recipient: {id:sender},
//       message: messageData,
//     }
//   }, function(error, response, body) {
//     if (error) {
//       // console.log('Error sending messages: ', error)
//       process.stderr.write(`\rError sending messages: ${error}`);
//     } else if (response.body.error) {
//       console.log('Error: ', response.body.error);
//       process.stderr.write(`\rError: ${response.body.error}`);
//     }
//   })
// }

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}

app.listen(app.get('port'), () => console.log('Listen http on ', app.get('port')));
