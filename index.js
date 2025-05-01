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

const startServer = async() => {
    try {
        const client = await MongoClient.connect(dbConnectionString);
        console.log(`Connected to ${dbName} Database`)
        const db = client.db(dbName);
        const tasksCollection = db.collection('tasks');

        app.get('/', async(req, res) => {
            try {
                const tasks = await tasksCollection.find().toArray();
                //console.log(tasks);
                res.render('index.ejs', { tasks: tasks});
            } catch(error) {
                console.error(error);
            }
        })
        
        app.post('/api/tasks', async(req, res) => {
            const taskName = req.body.taskName;
            try {
                const result = await tasksCollection.insertOne({ taskName: taskName, completed: false });
                console.log(`${taskName} added`);
                res.redirect('/');
            } catch(error) {
                console.error(error);
            }
        })
        
        app.listen(PORT, (req, res) => {
            console.log(`Server listening on port ${PORT}`);
        })

    } catch(error) {
        console.error(error);
    }
}

startServer();