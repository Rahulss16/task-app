const mongoose = require('mongoose')
const TaskModel = require('../model/Task');
const { validationResult } = require('express-validator')
const User = require('../model/User')
const getAllTasks = async (req, res) => {
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
const createTask = async (req, res) => {
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
        const { title, description, userId, isImportant, dueDate } = req.body
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
            userId,
            isImportant,
            dueDate
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
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params
        const task = await TaskModel.findById(id, {}).exec()

        if (task != null && task) {
            res.status(200).json({
                statusCode: 200,
                status: 'success',
                data: task,
                message: ''
            })
        } else {
            res.status(200).json({
                statusCode: 404,
                status: 'error',
                data: {},
                message: 'Task not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: 'Task not found',
            messageOnServer: error.message,
            data: {}
        })
    }
}
const updateTaskById = async (req, res) => {
    const { id } = req.params
    if (mongoose.Types.ObjectId.isValid(id)) {
        const task = await TaskModel.findById(id, {}).exec()

        if (task != null && task) {
            const { title, description, status, isImportant, dueDate } = req.body
            const task = await TaskModel.findByIdAndUpdate(id, {
                title,
                description,
                status,
                isImportant,
                dueDate,
                updatedAt: Date.now()
            }, {
                new: true,
                runValidators: true
            })
            res.status(200).json({
                statusCode: 200,
                status: 'success',
                data: task,
                message: ''
            })
        } else {
            res.status(200).json({
                statusCode: 404,
                status: 'error',
                data: {},
                message: 'Task not found'
            })
        }

    } else {
        res.status(200).json({
            statusCode: 404,
            status: 'error',
            message: 'Task not found',
            data: {}
        })
    }
}
const deleteTaskById = async (req, res) => {
    const { id } = req.params
    if (mongoose.Types.ObjectId.isValid(id)) {
        const task = await TaskModel.findById(id, {}).exec()

        if (task != null && task) {
            await TaskModel.findByIdAndUpdate(id, {
                deletedAt: Date.now()
            }, {
                new: true,
                runValidators: true
            })
            
            // const task = await TaskModel.findByIdAndDelete(id).exec() // Hard Delete
            res.status(200).json({
                statusCode: 200,
                status: 'success',
                data: {},
                message: 'Task Deleted'
            })
        } else {
            res.status(200).json({
                statusCode: 404,
                status: 'error',
                data: {},
                message: 'Task not found'
            })
        }
    } else {
        res.status(200).json({
            statusCode: 404,
            status: 'error',
            message: 'Task not found',
            data: {}
        })
    }
}
module.exports = {
    getAllTasks: getAllTasks,
    getTaskById: getTaskById,
    createTask: createTask,
    updateTaskById: updateTaskById,
    deleteTaskById: deleteTaskById
}