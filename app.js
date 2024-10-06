var express = require("express");
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const mongoose = require('mongoose');

var indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const projectsRouter = require("./routes/projects");
const userDataRouter = require("./routes/userData");
const searchProjectsRouter = require("./routes/searchProjects");

var app = express();

// 1. **Connect to MongoDB with Error Handling**:
mongoose.connect(process.env.MONGO_URL, { 
  dbName: 'OpTask'
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// 2. **Middleware Setup**:
app.use(logger("dev"));  // Log HTTP requests in development
app.use(express.json());  // Parse incoming JSON requests
app.use(express.urlencoded({ extended: false }));  // Parse URL-encoded data
app.use(cookieParser());  // Parse cookies



// 4. **Session Setup**:
app.use(
  session({
    secret: process.env.SESSION_SECRET,  // Secret for signing session cookies
    resave: false,  // Don't save session if unmodified
    saveUninitialized: true,  // Save new sessions that are uninitialized
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,  // MongoDB URL for session storage
      dbName: 'OpTask',
      collection: 'sessions',  // Store sessions in 'sessions' collection
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,  // Session cookie expiration: 7 days
    },
  })
);

// 5. **Passport Initialization**:
require("./auth/passportConfig");  // Load passport configuration
app.use(passport.initialize());  // Initialize passport
app.use(passport.session());  // Persistent login sessions

// 6. **Conditional Logging (only in development mode)**:
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Session:', req.session);  // Log session object in development
    console.log('User:', req.user);  // Log user object (if authenticated)
  }
  next();  // Move to next middleware/route handler
});

// 7. **Route Definitions**:
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/projects", projectsRouter);
app.use("/userData", userDataRouter);
app.use("/searchProjects", searchProjectsRouter);


// 9. **Export the app**:
module.exports = app;
