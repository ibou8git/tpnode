const courses = [
  {
    title: "Introduction à l'IA",
    description: "Découvrez les fondamentaux de l'intelligence artificielle.",
    price: 199,
    level: "Débutant"
  },
  {
    title: "Machine Learning Fondamental",
    description: "Apprenez les principes du machine learning et les algorithmes de base.",
    price: 299,
    level: "Intermédiaire"
  },
  {
    title: "Deep Learning Avancé",
    description: "Maîtrisez les réseaux de neurones profonds et leurs applications.",
    price: 399,
    level: "Avancé"
  }
];

exports.index = (req, res) => {
  res.render("index", { pageTitle: "Accueil" });
};

exports.about = (req, res) => {
  res.render("about", { pageTitle: "À propos" });
};

exports.courses = (req, res) => {
  res.render("courses", {
    pageTitle: "Nos Cours",
    courses: courses
  });
};

exports.contact = (req, res) => {
  res.render("contact", { pageTitle: "Contact" });
};

exports.processContact = (req, res) => {
  console.log("Données du formulaire reçues:");
  console.log(req.body);

  req.session.notifications = [
    { type: "success", message: "Votre message a été envoyé avec succès." }
  ];

  res.redirect("/contact");
};


exports.faq = (req, res) => {
  const faqs = [
    {
      question: "Qu'est-ce que l'AI Academy ?",
      answer: "L'AI Academy est une plateforme dédiée à l'apprentissage de l'intelligence artificielle."
    },
    {
      question: "Quels cours proposez-vous ?",
      answer: "Nous proposons des cours sur le machine learning, le deep learning, et bien plus encore."
    },
    {
      question: "Les cours sont-ils gratuits ?",
      answer: "Certains cours sont gratuits, tandis que d'autres sont payants."
    },
    {
      question: "Comment puis-je m'inscrire ?",
      answer: "Vous pouvez vous inscrire en créant un compte sur notre site."
    },
    {
      question: "Puis-je obtenir un certificat ?",
      answer: "Oui, un certificat est délivré après avoir terminé un cours payant."
    }
  ];
  res.render("faq", {
    pageTitle: "FAQ",
    faqs: faqs
  });
};

