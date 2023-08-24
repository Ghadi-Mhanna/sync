require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
//CORS POLICY
var whitelist = ["http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
// ROUTES
app.use("/static", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.send("Welcome to our Api page");
});
require("./routes")(app);

// MISSING ROUTES
app.use("*", (req, res) => {
  return res.status(404).json({message: "Route not found"});
});

// SERVER PORT
const PORT = process.env.APP_PORT || 9900;

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
