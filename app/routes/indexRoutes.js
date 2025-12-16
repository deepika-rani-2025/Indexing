const express = require('express');
const indexController = require('../controller/indexController');

const router = express.Router();

router.post('/createIndex',indexController.createIndex);
router.get('/getAll',indexController.getAll);
router.get('/search',indexController.search);

module.exports = router;