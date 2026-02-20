const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    userTask: String,
    status: { type: Boolean, default: false }
});

module.exports = mongoose.model("Todo", TodoSchema);
