const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: 0
    },
    isImportant: {
        type: Boolean,
        default: 0
    },
    dueDate: {
        type: Date,
        required: true
    },
    deletedAt: {
        type: Date,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: false
    }
})
taskSchema.pre('find', function() {
    this.where({ deletedAt : null })
})
taskSchema.pre('findOne', function() {
    this.where({ deletedAt : null })
})

module.exports = mongoose.model('Task', taskSchema)