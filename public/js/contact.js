const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/send-message', contactController.validateContactForm, (req, res) => {
    res.send('Message envoyé avec succès.');
});

module.exports = router;