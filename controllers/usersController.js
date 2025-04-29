const User = require("../models/user");

// Fonction utilitaire pour extraire les paramètres utilisateur
const getUserParams = body => ({
  name: {
    first: body.first,
    last: body.last
  },
  email: body.email,
  password: body.password, // Note: Le mot de passe devrait être hashé avant stockage
  zipCode: body.zipCode
});

module.exports = {
  // Liste tous les utilisateurs
  index: async (req, res, next) => {
    try {
      const users = await User.find({});
      res.locals.users = users;
      next();
    } catch (error) {
      console.error(`Error fetching users: ${error.message}`);
      next(error);
    }
  },

  // Affiche la vue liste
  indexView: (req, res) => {
    res.render("users/index", { 
      flashMessages: req.flash() 
    });
  },

  // Affiche le formulaire de création
  new: (req, res) => {
    res.render("users/new", {
      flashMessages: req.flash()
    });
  },

  // Crée un nouvel utilisateur
  create: async (req, res, next) => {
    try {
      const userParams = getUserParams(req.body);
      const newUser = new User(userParams);
      
      // Enregistrement avec Passport si utilisé
      User.register(newUser, req.body.password, (error, user) => {
        if (error) {
          req.flash('error', `Failed to create user: ${error.message}`);
          res.locals.redirect = "/users/new";
          return next();
        }
        req.flash('success', 'User created successfully!');
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      });
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      req.flash('error', 'Failed to create user');
      res.locals.redirect = "/users/new";
      next(error);
    }
  },

  // Redirection
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else {
      next();
    }
  },

  // Affiche un utilisateur
  show: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/users');
      }
      
      res.locals.user = user;
      next();
    } catch (error) {
      console.error(`Error fetching user: ${error.message}`);
      next(error);
    }
  },

  // Affiche la vue détail
  showView: (req, res) => {
    res.render("users/show", {
      flashMessages: req.flash()
    });
  },

  // Affiche le formulaire d'édition
  edit: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      
      res.render("users/edit", {
        user: user,
        flashMessages: req.flash()
      });
    } catch (error) {
      console.error(`Error fetching user for edit: ${error.message}`);
      req.flash('error', 'Error loading edit form');
      res.redirect('/users');
    }
  },

  // Met à jour un utilisateur
  update: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const userParams = getUserParams(req.body);
      
      await User.findByIdAndUpdate(userId, userParams);
      req.flash('success', 'User updated successfully!');
      res.locals.redirect = `/users/${userId}`;
      next();
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      req.flash('error', 'Failed to update user');
      res.locals.redirect = `/users/${req.params.id}/edit`;
      next();
    }
  },

  // Supprime un utilisateur
  delete: async (req, res, next) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndRemove(userId);
      req.flash('success', 'User deleted successfully!');
      res.locals.redirect = "/users";
      next();
    } catch (error) {
      console.error(`Error deleting user: ${error.message}`);
      req.flash('error', 'Failed to delete user');
      res.locals.redirect = `/users/${req.params.id}`;
      next();
    }
  },
  getApiToken: (req, res) => {
    if (req.user) {
    let signedToken = jsonWebToken.sign(
    {
    data: req.user._id,
    exp: new Date().setDate(new Date().getDate() + 30) // Token valable 30 jours
    },
    token_key
    );
    res.render("users/api-token", {
    token: signedToken
    });
    } else {
    req.flash("error", "Vous devez être connecté pour obtenir un token API.");
    res.redirect("/login");
    }
    },

  // Affiche le profil utilisateur
  profile: (req, res) => {
    if (!req.user) {
      req.flash('error', 'Please login to view profile');
      return res.redirect('/login');
    }
    
    res.render("users/profile", {
      pageTitle: "User Profile",
      user: req.user,
      flashMessages: req.flash()
    });
  }

  
};