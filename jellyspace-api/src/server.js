const express = require("express");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const otpRoute = require("./routes/otpRoute");
const projectRoute = require("./routes/projectRoute");
const emailRoute = require("./routes/emailRoute");
const bidRoute = require("./routes/bidRoute");
const cors = require("cors");
const sequelize = require("./config/database"); // Import Sequelize instance

const app = express();

// Load environment variables from .env file
dotenv.config();

// Define port and PostgreSQL connection URL from environment variables
const port = process.env.PORT || 8080;

// Configure CORS
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  optionSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api", userRoute);
app.use("/api", otpRoute);
app.use("/api", projectRoute);
app.use("/api", emailRoute);
app.use("/api", bidRoute);

// Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log("Successfully connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Connection failed:", err);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is active on port ${port}`);
});

module.exports = app;
