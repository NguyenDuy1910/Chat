const express = require("express");
const configViewEngine = require("./src/config/viewEngine");
const initWebRouters = require("./src/routes/web");
const bodyParser = require("body-parser");
const app = express();

configViewEngine(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3000;
initWebRouters(app);
app.listen(PORT, () => {
  console.log("hello");
});
