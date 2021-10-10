const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const connectDb = require("./db");
const logger = require("./logger");
const cors = require("cors");

const app = express();
connectDb();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(routes);

app.use("/*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  logger.success(`Server is started at ${port}`);
});
