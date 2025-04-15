const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({})
    .exec()
    .then((subscribers) => {
      res.render("subscribers/index", {
        pageTitle: "Liste des abonnés",
        subscribers: subscribers
      });
    })
    .catch((error) => {
      console.log(`Erreur lors de la récupération des abonnés : ${error.message}`);
      next(error);
    });
};

exports.getSubscriptionPage = (req, res) => {
  res.render("subscribers/new", { pageTitle: "S'abonner" });
};

exports.saveSubscriber = (req, res, next) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });

  newSubscriber
    .save()
    .then(() => {
      res.render("subscribers/thanks", { pageTitle: "Merci pour votre inscription !" });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.render("subscribers/new", {
          pageTitle: "S'abonner",
          errors: error.errors
        });
      } else {
        console.log(`Erreur lors de la sauvegarde de l'abonné : ${error.message}`);
        next(error);
      }
    });
};

exports.show = (req, res, next) => {
  let subscriberId = req.params.id;

  Subscriber.findById(subscriberId)
    .then((subscriber) => {
      if (!subscriber) {
        return res.status(404).render("error", {
          pageTitle: "Erreur 404",
          errorCode: 404,
          message: "Abonné non trouvé"
        });
      }

      res.render("subscribers/show", {
        pageTitle: "Détails de l'abonné",
        subscriber: subscriber
      });
    })
    .catch((error) => {
      console.log(`Erreur lors de la récupération d'un abonné par ID : ${error.message}`);
      next(error);
    });
};

exports.getEditPage = (req, res, next) => {
  let subscriberId = req.params.id;

  Subscriber.findById(subscriberId)
    .then((subscriber) => {
      if (!subscriber) {
        return res.status(404).render("error", {
          pageTitle: "Erreur 404",
          errorCode: 404,
          message: "Abonné non trouvé"
        });
      }

      res.render("subscribers/edit", {
        pageTitle: "Modifier l'abonné",
        subscriber: subscriber
      });
    })
    .catch((error) => {
      console.log(`Erreur lors de la récupération de l'abonné pour modification : ${error.message}`);
      next(error);
    });
};

exports.updateSubscriber = (req, res, next) => {
  let subscriberId = req.params.id;

  Subscriber.findByIdAndUpdate(subscriberId, {
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  })
    .then(() => {
      res.redirect(`/subscribers/${subscriberId}`);
    })
    .catch((error) => {
      console.log(`Erreur lors de la mise à jour de l'abonné : ${error.message}`);
      next(error);
    });
};

exports.searchSubscribers = (req, res, next) => {
  let query = {};
  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: "i" }; // Recherche insensible à la casse
  }
  if (req.query.zipCode) {
    query.zipCode = req.query.zipCode;
  }

  Subscriber.find(query)
    .then((subscribers) => {
      res.render("subscribers/index", {
        pageTitle: "Résultats de la recherche",
        subscribers: subscribers
      });
    })
    .catch((error) => {
      console.log(`Erreur lors de la recherche des abonnés : ${error.message}`);
      next(error);
    });
};

exports.deleteSubscriber = (req, res, next) => {
    let subscriberId = req.params.id;
  
    Subscriber.findByIdAndDelete(subscriberId)
      .then(() => {
        res.redirect("/subscribers");
      })
      .catch((error) => {
        console.log(`Erreur lors de la suppression de l'abonné : ${error.message}`);
        next(error);
      });
  };
  