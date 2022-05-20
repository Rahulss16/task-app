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
router.get(
    '/:id',
    auth,
    TaskController.getTaskById
)
/**
 * 
 */

router.post(
    '/',
    [
        check('title', 'Task must have a title')
            .notEmpty()
            .isString(),
        check('userId', 'Task must have a user id')
            .notEmpty()
    ],
    auth,
    TaskController.createTask
)

/**
 * 
 */

router.put(
    '/:id',
    auth,
    TaskController.updateTaskById
)
/**
 * 
 */
router.delete(
    '/:id',
    auth,
    TaskController.deleteTaskById
)

module.exports = router