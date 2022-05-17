const TaskModel = require('../model/Task');

const getAllTasks = async (req, res, next) => {
    return res.status(200).json({
        statusCode: 200,
        status: 'success',
        message: 'tasks',
        data: {}
    })
}

module.exports = {
    getAllTasks: getAllTasks
}