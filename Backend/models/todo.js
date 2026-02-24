const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    userTask: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);