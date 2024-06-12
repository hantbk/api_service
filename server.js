const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/default.config.js");
const userRoutes = require("./src/routes/user.routes.js");
const authRoutes = require("./src/routes/auth.routes.js");
const memoryUsage = require("process").memoryUsage;
const cpus = require("os").cpus;

// create express app
const app = express();
const PORT = config.port;

const client = require("prom-client");

//  * CREATES A NEW OBJECT CONTAINING THE METRICS LABEL NAMES
const metric_label_enum = {
  PATH: "path",
  METHOD: "method",
  STATUS_CODE: "status_code",
};
// * CREATES A NEW CLASS FOR ASSIGNING LABELS TO VARIOUS METRICS
class MetricLabelClass {
  constructor(method, pathname, statusCode) {
    this.method = method;
    this.path = pathname;
    this.status_code = statusCode;
  }
}
// * REGISTERS A NEW PROMETHEUS CLIENT
const register = new client.Registry();
// * The http_request counter for measuring the total no of requests made to the application
const http_request_total = new client.Counter({
  name: "node_http_request_total",
  help: "The total number of HTTP requests received",
  labelNames: [
    metric_label_enum.PATH,
    metric_label_enum.METHOD,
    metric_label_enum.STATUS_CODE,
  ],
});
// * The http_response rate histogram for measuring the response rates for each http request
const http_response_rate_histogram = new client.Histogram({
  name: "node_http_duration",
  labelNames: [
    metric_label_enum.PATH,
    metric_label_enum.METHOD,
    metric_label_enum.STATUS_CODE,
  ],
  help: "The duration of HTTP requests in seconds",
  buckets: [
    0.0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3,
    1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 10,
  ],
});
// * The node_js memory guage for measuring the memory of the application in use
const nodejs_memory = new client.Gauge({
  name: "node_memory_usage_bytes",
  help: "Current memory usage of the Node.js process in bytes",
});
// * The node_js CPU usage guage for measuring the memory of the application in use
const nodejs_cpu_usage = new client.Gauge({
  name: "node_cpu_usage_percent",
  help: "CPU utilization of the Node.js process in percentage",
});

client.collectDefaultMetrics({
  register: register,
  prefix: "node_", // * Prefixes the default app metrics name with the specified string
});
// * Registers the HTTP request counter metric
register.registerMetric(http_request_total);
// * Registers the HTTP response rate metric
register.registerMetric(http_response_rate_histogram);
// * Registers the Node Js memory guage metric
register.registerMetric(nodejs_memory);
// * Registers the Node Js cpu usage guage metric
register.registerMetric(nodejs_cpu_usage);

/**
 * Calculates the current CPU usage
 * @returns number
 */
const calculate_cpu_usage = () => {
  const previousTotalTime = process.hrtime()[0]; // Store previous total CPU time

  // Get current CPU usage data
  const cpusData = cpus();

  // Calculate cumulative CPU times
  const currentTotalTime = cpusData.reduce(
    (acc, cpu) => acc + Object.values(cpu.times).reduce((a, b) => a + b, 0),
    0
  );

  // Calculate CPU usage based on time elapsed and total CPU time
  const idleTime = currentTotalTime - previousTotalTime;
  const cpuUsage = 100 - (idleTime / currentTotalTime) * 100;

  // Store current total CPU time for the next calculation
  process.hrtime()[0] = currentTotalTime;

  return cpuUsage;
};

app.use((req, res, next) => {
  const req_url = new URL(req.url, `http://${req.headers.host}`);
  const endTimer = http_response_rate_histogram.startTimer();
  const used_memory_before = memoryUsage().rss;
  const used_cpu_before = calculate_cpu_usage();

  const original_res_send_function = res.send;

  const res_send_interceptor = function (body) {
    if (!res.headersSent) {
      // Ends the histogram timer for the request
      const timer = endTimer(
        new MetricLabelClass(req.method, req_url.pathname, res.statusCode)
      );
      console.log(`HTTP request took ${timer} seconds to process`);

      const used_memory_after = memoryUsage().rss;
      const used_cpu_after = calculate_cpu_usage();

      http_request_total.inc(
        new MetricLabelClass(req.method, req_url.pathname, res.statusCode)
      );

      nodejs_memory.set(used_memory_after - used_memory_before);
      nodejs_cpu_usage.set(used_cpu_after - used_cpu_before);

      original_res_send_function.call(this, body);
    }
  };

  res.send = res_send_interceptor;
  next();
});

/**
 * Get's the metrics to be fed to the prometheus server
 * @param req The express Js req object
 * @param res The express Js response object
 * @param next The express Js next function
 */
app.get("/metrics", async (req, res, next) => {
  res.setHeader("Content-type", register.contentType);
  res.send(await register.metrics());
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(config.dbUrl)
  .then(() => {
    console.log("Successfully connected to the database");
  }).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });

app.get("/", (req, res, next) => {
  res.setHeader("Content-Type", "text/html");
  res.send("<h1>Welcome to the User API</h1>");
  next();
});

// User Routes
app.use("/api/users", userRoutes);

// Auth Routes
app.use("/auth", authRoutes);

// listen for requests
app.listen(PORT, function () {
  console.log("Server is listening on port " + PORT);
});
