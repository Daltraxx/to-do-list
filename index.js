require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const dbConnectionString = process.env.DB_STRING;
const dbName = 'tasks-list';

const connectMongoClientToDB = async() => {
    try {
        const client = await MongoClient.connect(dbConnectionString);
        console.log(`Connected to ${dbName} database.`);
        return client.db(dbName);
    } catch(error) {
        console.error(error);
    }
}

const connectToTasksCollection = async() => {
    try {
        const db = await connectMongoClientToDB();
        const tasksCollection = db.collection('tasks');
        return tasksCollection;
    } catch(error) {
        console.error(error);
    }
}

const getTasks = async() => {
    const tasksCollection = await connectToTasksCollection();
    const tasks = await tasksCollection.find().toArray();
    return tasks;
}

app.get('/', async(req, res) => {
    try {
        const tasks = await getTasks();
        console.log(tasks);
        res.render('index.ejs', { tasks: tasks});
    } catch(error) {
        console.error(error);
    }
})

app.post('/api/tasks', async(req, res) => {
    const taskName = req.body.taskName;
    try {
        const tasksCollection = await connectToTasksCollection();
        tasksCollection.insertOne({ taskName: taskName, completed: false })
            .then(() => {
                console.log('Task added');
                res.redirect('/');
            })

    } catch(error) {
        console.error(error);
    }
})

app.listen(PORT, (req, res) => {
    console.log(`Server listening on port ${PORT}`);
})