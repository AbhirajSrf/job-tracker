const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicationsController');

router.get('/', controller.listApplications);
router.get('/:id', controller.getApplication);
router.post('/', controller.createApplication);
router.patch('/:id', controller.updateApplication);
router.delete('/:id', controller.deleteApplication);

module.exports = router;
