const express = require("express");
const configViewEngine = require("./config/viewEngine");
const initWebRouters = require("./routes/web");
const bodyParser = require("body-parser");
const app = express();

configViewEngine(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
initWebRouters(app);
app.listen(3000, () => {
  console.log("hello");
});
