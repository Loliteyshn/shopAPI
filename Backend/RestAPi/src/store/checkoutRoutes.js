const { Router } = require('express');
const checkoutController = require('./controllers/checkoutController');
const router = Router();

router.post('/add', checkoutController.addOrder);

module.exports = router;