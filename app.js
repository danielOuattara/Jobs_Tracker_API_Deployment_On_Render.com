require("dotenv").config();
require("express-async-errors");
const express = require("express");
const auth = require("./middleware/authentication");
// routers modules
const authRouter = require("./routes/authRoutes");
const jobRouter = require("./routes/jobsRoutes");
// error handler modules
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// End of import
// ------------------------------------------------------------------

const app = express();

// security packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 5000,
    max: 200,
    message: { code: 429, message: "Too many connection; Try later !" },
  }),
);

app.use(express.json());

app.get("/", (req, res) =>
  res.status(200).send(
    `<h1> welcome to job API</h1>
    <p>go to <a href="https://job-api-ro2h.onrender.com/api/v1/auth"> this link</a> for testing backend API authentication</p>
    <p>go to <a href="https://job-api-ro2h.onrender.com/api/v1/jobs"> this link</a> for testing backend API jobs</p>
    <br />
    Use those links with postman for example, before I finalize a Swager.io interface for testing directly
    the backend`,
  ),
);
// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", auth, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
