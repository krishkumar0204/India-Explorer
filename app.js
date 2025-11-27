if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressError = require("./util/ExpressError.js");
const ExplorePlaces = require("./models/explore.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const exploreRouter = require("./routes/explore.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const DB_URL = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("connection successfully");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(DB_URL);
}
const store = MongoStore.create({
  mongoUrl: DB_URL,
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.log("Error in Mongo session store", err);
});

const sessionOPtions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.use(session(sessionOPtions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

app.use("/explore", exploreRouter);
app.use("/explore/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", async (req, res) => {
  try {
    const explores = await ExplorePlaces.find({}).limit(6);
    res.render("Explore/landing.ejs", { explores });
  } catch (err) {
    console.log(err);
    res.render("Explore/landing.ejs", { explores: [] });
  }
});

app.get("/search", async (req, res, next) => {
  try {
    const query = req.query.q;
    let explores;

    if (query) {
      explores = await ExplorePlaces.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
          { country: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      explores = await ExplorePlaces.find({});
    }

    res.render("Explore/index.ejs", { explores, query });
  } catch (err) {
    next(err);
  }
});

app.all(/.*/, (req, res, next) => {
  next(new expressError(404, "Page not found !"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
