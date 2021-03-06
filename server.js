const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const server = http.createServer(app);

// Handles all uncaught error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception!! Shutting Down");
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Database Connected Successfully"));

const port = process.env.PORT || 6000;

server.listen(port, () => console.log(`App running on port ${port}`));

// Handles all uncaught promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!! Closing Server then shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
