const getHomePage = (req, res) => {
  return res.send("xin chao");
};
const postWebhook = (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    res.status(200).send("OK");
  } else {
    // Respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
};
const getWebhook = (req, res) => {
  // Parse the query params
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === config.verifyToken) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};
module.exports = {
  getHomePage: getHomePage,
  getWebhook: getWebhook,
  postWebhook: postWebhook,
};
