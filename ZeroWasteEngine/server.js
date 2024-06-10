require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const passport = require("./src/auth/passportConfig");
const { connect } = require("./src/db/connection");
const authRoutes = require("./src/routes/authRoutes");
const listingsRoutes = require("./src/routes/listingsRoutes");
const botRoutes = require("./src/routes/botRoutes");
const config = require("./config/dbconfig");
const { bot } = require("./src/controllers/bot/botController");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);
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
});

app.use("/auth", authRoutes);

app.use(
  "/listing",
  passport.authenticate("jwt", { session: false }),
  listingsRoutes
);

app.use("/bot", botRoutes);

app.listen(port, async () => {
  console.log(`API running at http://localhost:${port}`);
  try {
    await connect();
    bot.launch();
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
});
