const { body, validationResult } = require('express-validator');

exports.validateContactForm = [
    body('name').notEmpty().withMessage('Le nom est requis.'),
    body('email').isEmail().withMessage('Veuillez entrer une adresse email valide.'),
    body('message').notEmpty().withMessage('Le message ne peut pas être vide.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('contact', { errors: errors.array() });
        }
        next();
    }
];