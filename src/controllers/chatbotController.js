require("dotenv").config();
const request = require("request");
const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
const verify_token = process.env.verify_token;
const getHomePage = (req, res) => {
  return res.send("xin chao123");
};
const postWebhook = (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send("OK");
  } else {
    // Respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
};

const getWebhook = (req, res) => {
  // Parse the query params

  console.log(verify_token);

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};
function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`,
    };
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}
function handleMessage(sender_psid, received_message) {
  let response;

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
    };
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Đây phải ảnh của bạn không",
              subtitle: "Nhấn nút ở dưới để trả lời.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Có!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "Không!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops, try sending another image." };
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform API
  request(
    {
      uri: "https://graph.facebook.com/v11.0/me/messages",
      qs: { access_token: MY_VERIFY_TOKEN },
      method: "POST",
      json: request_body,
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Message sent successfully!");
        console.log(body); // Debugging purpose only
      } else {
        console.error("Unable to send message:" + error);
        console.error(response); // Debugging purpose only
      }
    }
  );
}

module.exports = {
  getHomePage: getHomePage,
  getWebhook: getWebhook,
  postWebhook: postWebhook,
};
