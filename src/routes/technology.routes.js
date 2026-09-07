const { Router } = require('express');
const technologyController = require('../controllers/technology.controller');
const validate = require('../middlewares/validate');
const { createTechnologySchema } = require('../dtos/technology.dto');

const router = Router();

router.post('/', validate(createTechnologySchema), technologyController.create);
router.get('/', technologyController.findAll);

module.exports = router;
