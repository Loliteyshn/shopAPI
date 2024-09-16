const { Router } = require('express');
const { route } = require('express/lib/application');
const clientController = require('./controllers/clientController');
const router = Router();

router.put('/updateClient', clientController.updateClient);

module.exports = router;