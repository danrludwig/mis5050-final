"use strict";

const express = require("express"),
  app = express(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  path = require("path"),
  fileUpload = require("express-fileupload"),
  passport = require("passport"),
  expressSession = require("express-session"),
  User = require("./models/user"),
  methodOverride = require("method-override");

// Controllers
const homeController = require("./controllers/homeController");
const stylesController = require("./controllers/stylesController");
const blogPostsController = require("./controllers/blogPostsController");
const contactsController = require("./controllers/contactsController");
const errorController = require("./controllers/errorController");
const userController = require("./controllers/userController");
const user = require("./models/user");
const apiController = require("./controllers/apiController");

// App Settings
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(layouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 5000000
    },
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})

app.use(fileUpload());

// Database Connection
mongoose.connect(
    "mongodb+srv://myUser:myPassword@cluster0.bty6y.mongodb.net/mustacchio?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
  );

// Home routes
app.get("/", homeController.home);
app.get("/about", homeController.about);

// Style routes
app.get("/gallery", stylesController.showAllStyles);
app.get("/style/new", stylesController.newStyle);
app.get("/style/:id", stylesController.showStyle);
app.post("/style/create", stylesController.createStyle);

// Blog routes
app.get("/blog", blogPostsController.showAllPosts);
app.get("/blog/:id", blogPostsController.showPost);

// Contact routes
app.get("/contacts/new", contactsController.newContact);
app.post("/contacts/create", contactsController.createContact);
app.get("/contacts", userController.checkAdmin, contactsController.getUnrespondedContacts);
app.get("/contacts/:id/edit", userController.checkAdmin, contactsController.getContactById);
app.post("/contacts/:id/update", contactsController.updateContactById);

// User routes
app.get("/user/login", userController.loginPage);
app.post("/user/login", userController.authenticate);
app.get("/user/new", userController.new);
app.post("/user/create", userController.create, userController.redirectView);
app.get("/user/logout", userController.logout, userController.redirectView);
app.get("/user/:id/add-favorite", userController.addFavorite, userController.redirectView);
app.get("/user/favorite-styles", userController.getFavorites);
app.get("/user/list", userController.userList);

// API routes
app.get("/api/styles", apiController.getStyles);

// Error routes
app.use(errorController.handleErrors);
 
// Start server
app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
  });