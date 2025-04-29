const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

// Middleware de validation
const validateUser = [
  body("first").notEmpty().trim().withMessage("Le prénom est requis"),
  body("last").notEmpty().trim().withMessage("Le nom est requis"),
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password").isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(e => e.msg).join(", "));
      return res.redirect("/users/new");
    }
    next();
  }
];

// Protection des routes
router.use(authController.ensureLoggedIn);

// Routes CRUD
router.get("/", usersController.index, usersController.indexView);
router.get("/new", usersController.new);
router.post("/create", validateUser, usersController.create, usersController.redirectView);
router.get("/:id", usersController.show, usersController.showView);
router.get("/:id/edit", usersController.edit);
router.put("/:id/update", usersController.update, usersController.redirectView);
router.delete("/:id/delete", usersController.delete, usersController.redirectView);
router.get("/api-token", usersController.getApiToken);

// Vérification que tous les handlers sont bien définis
const requiredMethods = [
  'index', 'indexView', 'new', 'create', 'show', 'showView', 
  'edit', 'update', 'delete', 'redirectView', 'getApiToken'
];

requiredMethods.forEach(method => {
  if (typeof usersController[method] !== 'function') {
    console.error(`ERREUR: usersController.${method} n'est pas une fonction!`);
    process.exit(1);
  }
});

module.exports = router;