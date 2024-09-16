const { Router } = require('express');
const { route } = require('express/lib/application');
const authController = require('./controllers/authController');

const router = Router();

router.post('/registration', authController.registration);
router.get('/login', authController.login);
router.get('/checkout/:user_id', authController.getUserByUserId);
router.get('/approve-registration/:email', authController.approveRegistration)

module.exports = router;