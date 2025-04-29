const express = require('express');
const router = express.Router();
const subscribersController = require('../controllers/subscribersController');

// Routes GET
router.get('/', subscribersController.getAllSubscribers);
router.get('/new', subscribersController.getSubscriptionPage);
router.get('/search', subscribersController.searchSubscribers);
router.get('/:id', subscribersController.show);
router.get('/:id/edit', subscribersController.getEditPage);

// Routes POST/PUT/DELETE
router.post('/', subscribersController.saveSubscriber);
router.put('/:id', subscribersController.updateSubscriber);
router.delete('/:id', subscribersController.deleteSubscriber);

module.exports = router;