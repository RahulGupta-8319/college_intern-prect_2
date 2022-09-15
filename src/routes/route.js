const express = require('express');
const router = express.Router();
const collegeController = require('../controller/collegeController')
const internControlller = require('../controller/internController')


router.post('/functionup/colleges' , collegeController.College)
router.post('/functionup/interns' , internControlller.intern)
router.get('/functionup/collegeDetails', internControlller.collegeDetails)
module.exports = router;