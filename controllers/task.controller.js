const TaskModel = require('../model/Task');
const { validationResult } = require('express-validator')
const User = require('../model/User')
const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await TaskModel.find({})
            .sort({ _id: -1 })
            .exec()
        res.status(200).json({
            statusCode: 200,
            status: 'success',
            data: tasks,
            message: ''
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: error.message,
            data: {}
        })
    }
}

const createTask = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(200).json({
            statusCode: 400,
            status: 'error',
            message: errors.array()[0].msg,
            data: {}
        })
    }
    try {
        const { title, description, userId } = req.body
        const user = await User.findById(userId, {
            tokens: 0,
            password: 0,
            confirmationCode: 0
        })
        if (!user) {
            return res.status(200).json({
                statusCode: 400,
                status: 'error',
                message: 'User not found',
                data: {}
            })
        }

        const task = new TaskModel({
            title,
            description,
            userId
        });
        await task.save()

        return res.status(200).json({
            statusCode: 200,
            status: 'success',
            data: {
                task: task,
                user: user
            },
            message: ''
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            data: error
        })
    }

}

module.exports = {
    getAllTasks: getAllTasks,
    createTask: createTask
}