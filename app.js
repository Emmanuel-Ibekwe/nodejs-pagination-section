// require("dotenv").config();

const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const multer = require("multer");
const flash = require("connect-flash");
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5aiiow7.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// };

console.log(MONGODB_URI);

console.log(process.env.NODE_ENV);

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
  // connectionOptions: {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // }
});

const csrfProtection = csrf();

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },

  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
// app.use(multer({ dest: "images" }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// This logs in the user
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
    csrfToken: ""
  });
});

mongoose
  .connect(MONGODB_URI})
  // .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(result => {
    app.listen(process.env.PORT || 3000);
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });

// 2bbe886cff01f90a1295bb8292a9725b-us21 mailchimp api key

// client id: 614807490457-f9ckj8t752qcjju04sde6uf7g9m2s7ae.apps.googleusercontent.com
// client secret: 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

// refresh token: c
// access token: ya29.a0AfB_byCx6M1Zrn5KbtQdjGC0qcujBUNxLcI5U0JY02bOct_MurdUGHy1njwqpKP9pvpOYal1iOEZ1WOa5-47eShTivBY2e6iVpGwUvYlWatARvv71WT96H1Ea5MCAQ0ZB96xG_wdO1HSVWc6LSarAZc9aPUiUElh31yxaCgYKAXESARESFQGOcNnCwcPnkNOxySg_hZU3z0YV6w0171

// access token 2: ya29.a0AfB_byC79aXVt9XtYqcpByrF-LuvIcN_bMdraGI-bJ87AhlpLwNztEXXr2VafWLCy3i9BxiS9Ejv4Di_scN6ALE-esG8sqCiXQfakdawxq_NMBWz9pptW5IdXxEDFsT5O9EJ1wZV0zsHwxXx9WPIA4Ffsz-F7W6XjzTsaCgYKAXMSARESFQGOcNnCbBuE7vjxVcQ2_xssYugkKQ0171
