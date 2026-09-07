const { Router } = require('express');
const profileController = require('../controllers/profile.controller');
const validate = require('../middlewares/validate');
const { createProfileSchema } = require('../dtos/profile.dto');

const router = Router();

router.post('/', validate(createProfileSchema), profileController.create);
router.get('/:id', profileController.findById);

module.exports = router;
