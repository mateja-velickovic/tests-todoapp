const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true,
    },
});

const TodoModel = mongoose.model('todo', todoSchema);

module.exports = TodoModel;