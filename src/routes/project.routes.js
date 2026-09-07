const { Router } = require('express');
const projectController = require('../controllers/project.controller');
const validate = require('../middlewares/validate');
const { createProjectSchema } = require('../dtos/project.dto');

const router = Router();

router.post('/', validate(createProjectSchema), projectController.create);
router.get('/', projectController.findAll);

module.exports = router;
