const express = require('express')
const { check } = require('express-validator')
const auth = require('../middleware/auth')
const router = express.Router()

const TaskController = require('../controllers/task.controller')

/**
 * 
 */

router.get(
    '/',
    auth,
    TaskController.getAllTasks
)

module.exports = router