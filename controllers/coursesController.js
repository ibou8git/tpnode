const Course = require("../models/course");

// Fonction utilitaire pour extraire les paramètres du cours du corps de la requête
const getCourseParams = body => {
  return {
    title: body.title,
    description: body.description,
    maxStudents: body.maxStudents,
    cost: body.cost
  };
};

module.exports = {
  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération des cours: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render("courses/index");
  },

  new: (req, res) => {
    res.render("courses/new");
  },

  create: (req, res, next) => {
    let courseParams = getCourseParams(req.body);
    Course.create(courseParams)
      .then(course => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la création du cours: ${error.message}`);
        res.locals.redirect = "/courses/new";
        next();
      });
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .populate("students")
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération du cours par ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("courses/show");
  },

  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération du cours par ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = getCourseParams(req.body);
    Course.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la mise à jour du cours par ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la suppression du cours par ID: ${error.message}`);
        next();
      });
  },

  enroll: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      const user = req.user; // Assurez-vous que l'utilisateur est connecté
      if (!user.enrolledCourses.includes(course._id)) {
        user.enrolledCourses.push(course._id);
        await user.save();
      }
      req.session.notifications.push({ type: "success", message: "Inscription réussie au cours !" });
      res.redirect(`/courses/${course._id}`);
    } catch (error) {
      console.error(`Erreur lors de l'inscription : ${error.message}`);
      req.session.notifications.push({ type: "error", message: "Erreur lors de l'inscription au cours." });
      res.redirect("/courses");
    }
  },

  search: async (req, res) => {
    try {
      const query = req.query.q || ""; // Assurez-vous que la requête contient un paramètre `q`
      const courses = await Course.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } }
        ]
      });
      res.render("courses", { courses, searchTerm: query });
    } catch (error) {
      console.error(`Erreur lors de la recherche : ${error.message}`);
      res.status(500).send("Erreur lors de la recherche.");
    }
  }
};
