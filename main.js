const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const homeController = require("./controllers/homeController");
const subscribersController = require("./controllers/subscribersController");
const errorController = require("./controllers/errorController");
const app = express();

// Configuration de la connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion à MongoDB :"));
db.once("open", () => {
  console.log("Connexion réussie à MongoDB en utilisant Mongoose!");
});

// Configurez les sessions
app.use(
  session({
    secret: "votre_secret_pour_la_session",
    resave: false,
    saveUninitialized: true
  })
);
app.use((req, res, next) => {
  res.locals.pageTitle = "AI Academy"; // Valeur par défaut
  next();
});
app.use(layouts);
// Middleware pour injecter les notifications dans les vues
app.use((req, res, next) => {
  res.locals.notifications = req.session?.notifications || [];
  req.session.notifications = []; // Réinitialiser les notifications après affichage
  next();
});

// Configuration d'EJS comme moteur de template
app.set("view engine", "ejs");
app.use(layouts);

// Middleware pour traiter les données des formulaires
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static("public"));

// Définir les routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/search", subscribersController.searchSubscribers);
app.get("/search", (req, res) => {
    res.render("search", { pageTitle: "Recherche de Cours IA" });
  });
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/:id", subscribersController.show);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);
app.get("/faq", homeController.faq); // Route pour la FAQ       
app.get("/subscribers/:id/edit", subscribersController.getEditPage);
app.post("/subscribers/:id/update", subscribersController.updateSubscriber);
  
app.get("/api/courses/search", (req, res) => {
    const searchTerm = req.query.q;
  
    // Exemple de logique de recherche (à adapter selon votre modèle)
    Course.find({ title: { $regex: searchTerm, $options: "i" } })
      .then((courses) => {
        res.json({
          count: courses.length,
          searchTerm: searchTerm,
          results: courses,
        });
      })
      .catch((error) => {
        console.error(`Erreur lors de la recherche : ${error.message}`);
        res.status(500).json({ error: "Une erreur est survenue lors de la recherche." });
      });
  });
// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Middleware pour gérer les erreurs 404 et 500
app.use((req, res, next) => {
  res.status(404);
  res.render("error", {
    pageTitle: "Erreur 404",
    errorCode: 404,
    message: "La page demandée n'existe pas"
  });
});

// Démarrer le serveur
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log(`Le serveur a démarré et écoute sur le port: ${app.get("port")}`);
  console.log(`Serveur accessible à l'adresse: http://localhost:${app.get("port")}`);
});