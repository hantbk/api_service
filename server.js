const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/default.config.js");
const userRoutes = require("./src/routes/user.routes.js");
const morgan = require("morgan");

// create express app
const app = express();
const promBundle = require("express-prom-bundle");

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { app: "api", project_type: "test metrics" },
  promClient: { collectDefaultMetrics: {} },
});

app.use(metricsMiddleware);

// Log requests
app.use(morgan(':method :url :status'));

// Default endpoint
app.get("/", (req, res) => {
  res.json({
    "GET /": "All routes",
    "GET /metrics": "Metrics data for the API",
    "POST /createUser": "Create a new user",
    "GET /user/:userId": "Get a single user",
    "PUT /updateUser/:id": "Update a user",
    "DELETE /deleteUser/:id": "Delete a user",
    "POST /bye": "POST request: + post data",
  });
});

// Metrics endpoint
app.get("/metrics", (req, res) => {
  res.set("Content-Type", metricsMiddleware.promClient.register.contentType);
  res.end(metricsMiddleware.promClient.register.metrics());
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(config.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", function (err) {
  console.log(`Could not connect to the database: ${err}`);
  process.exit();
});
mongoose.connection.once("open", function () {
  console.log("Successfully connected to the database");
});

// Todo Routes
app.use("/", userRoutes);

// listen for requests
const PORT = config.port;
app.listen(PORT, function () {
  console.log("Server is listening on port " + PORT);
});
