const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const postRoute = require("./routes/postRoutes");
const userRoute = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const endpoints = require("./utils/endpoints")

const app = express();

if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"));
}

// MiddleWare for getting the data sent in the request body
app.use(express.json({ limit: "10kb" }));

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for enabling CORS (Cross Origin Request Sharing)
app.use(cors()); // Only works for simple requests (GET, POST)

// Middleware for enabling CORS for non-simple request (PATCH, PUT, DELETE, request with cookies etc)
app.options("*", cors());

// Routes
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "My Talent QL Technical Assessment Solution",
    endpoints,
  });
});
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/users", userRoute);

// Unhandled Routes
app.all("*", (req, res, next) => {
  const error = `Can't find ${req.originalUrl} on this server`;

  next(new AppError(error, 400));
});

// Error Handler
app.use(globalErrorHandler);

module.exports = app;
