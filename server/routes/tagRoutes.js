const express = require('express');
const router = express.Router();

//import controllers
const { createTag } = require('../controllers/tagController');


router.post('/createTag', createTag);


module.exports = router;