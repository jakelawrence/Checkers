const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//keeps DB_URI hidden
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//connect to MongoDB
const uri = process.env.DB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//establish saves route
const savesRouter = require("./routes/saves");

app.use("/saves", savesRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
