const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Todo = require("./models/Todo");
const Counter = require("./models/counter");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://Jayasri:Jayasri2816@cluster0.3ku3lfd.mongodb.net/todolist?appName=Cluster0")
.then(async () => {
    console.log("✅ MongoDB Connected");

    // Create counter document if not exist
    const counter = await Counter.findOne();
    if (!counter) {
        await Counter.create({ total: 0, completed: 0 });
    }
})
.catch(err => console.log(err));


// ================= GET TASKS =================
app.get("/todolist", async (req, res) => {
    const tasks = await Todo.find();
    res.json(tasks);
});


// ================= GET COUNTS =================
app.get("/counts", async (req, res) => {
    const counter = await Counter.findOne();
    res.json(counter);
});


// ================= ADD TASK =================
app.post("/todolist", async (req, res) => {

    const newTask = new Todo({
        userTask: req.body.userTask,
        status: false
    });

    await newTask.save();

    await Counter.updateOne({}, { $inc: { total: 1 } });

    res.json(newTask);
});


// ================= UPDATE STATUS =================
app.put("/todolist/:id", async (req, res) => {

    const task = await Todo.findById(req.params.id);

    const oldStatus = task.status;
    const newStatus = req.body.status;

    task.status = newStatus;
    await task.save();

    if (!oldStatus && newStatus) {
        await Counter.updateOne({}, { $inc: { completed: 1 } });
    }

    if (oldStatus && !newStatus) {
        await Counter.updateOne({}, { $inc: { completed: -1 } });
    }

    res.json(task);
});


// ================= DELETE =================
app.delete("/todolist/:id", async (req, res) => {

    const task = await Todo.findById(req.params.id);

    if (task.status) {
        await Counter.updateOne({}, { $inc: { completed: -1 } });
    }

    await Counter.updateOne({}, { $inc: { total: -1 } });

    await Todo.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
});


const PORT = process.env.PORT||3000;
app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});