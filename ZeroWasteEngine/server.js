require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./src/auth/passportConfig");
const { connect } = require("./src/db/connection");
const authRoutes = require("./src/routes/authRoutes");
const lisitingsRoutes = require("./src/routes/listingsRoutes");
const config = require("./config/dbconfig");

const app = express();
const port = 3000;

app.use(express.json()); // Middleware for parsing JSON bodies
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
    store: MongoStore.create({
      mongoUrl: config.mongoUri,
      ttl: 1000 * 60 * 60, // 1 hour
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World!");
  if (req.user && req.user.username) {
    console.log(`User logged in: ${req.user.username}`)
  }
});

app.use("/auth", authRoutes);

app.use("/listing", lisitingsRoutes);

app.listen(port, async () => {
  console.log(`API running at http://localhost:${port}`);
  try {
    await connect();
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
});
