// Importations
const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const path = require("path");
const httpStatus = require("http-status-codes");
const routes = require("./routes/index");
const authController = require("./controllers/authController");     

// Configuration de la connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion MongoDB:"));
db.once("open", () => {
  console.log("Connexion réussie à MongoDB en utilisant Mongoose!");
});

// Initialisation de l'application Express
const app = express();

// Configuration de l'application
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// Configuration des cookies et des sessions
app.use(cookieParser("secret_passcode"));
app.use(
  session({
    secret: "secret_passcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 4000000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

// Configuration de flash messages
app.use(flash());

// Configuration de Passport
const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour rendre les variables locales disponibles dans toutes les vues
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Routes d'authentification
app.get("/login", authController.login);
app.post("/login", authController.authenticate);
app.get("/signup", authController.signup);
app.post("/signup", authController.register);
// Routes protégées - accessibles uniquement aux utilisateurs connectés
app.use("/users", authController.ensureLoggedIn);
app.use("/courses/new", authController.ensureLoggedIn);
app.use("/courses/:id/edit", authController.ensureLoggedIn);

// Utilisation des routes
app.use("/", routes);

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND);
  res.render("errors/404", {
    pageTitle: "Page non trouvée",
    layout: "error-layout",
  });
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(httpStatus.INTERNAL_SERVER_ERROR);
  res.render("errors/500", {
    pageTitle: "Erreur serveur",
    layout: "error-layout",
  });
});

// Démarrage du serveur
app.listen(app.get("port"), () => {
  console.log(`Le serveur a démarré et écoute sur le port: ${app.get("port")}`);
  console.log(`Serveur accessible à l'adresse: http://localhost:${app.get("port")}`);
});