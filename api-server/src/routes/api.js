const express = require('express');
const generatorController = require('../controllers/generator.controller');

const router = express.Router();

router.post('/generate', generatorController.generateContent);

module.exports = router;
