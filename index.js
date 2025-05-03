require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const morgan = require('morgan');
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const{ MongoClient, ObjectId} = require('mongodb');

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
                // console.log(tasks);
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

        app.delete('/api/tasks', async(req, res) => {
            const taskID = req.query.id;
            console.log(taskID);
            try {
                const deleteResult = await tasksCollection.deleteOne({ _id: new ObjectId(taskID) });
                console.log(deleteResult);

                deleteResult.deletedCount > 0 ? 
                    res.status(200).json(`Task with id ${taskID} deleted`) :
                    res.status(404).json(`No task with id ${taskID} found`);
                
            } catch(error) {
                console.error(error);
                res.status(400).json('Invalid ID');
            }
        })

        app.put('/api/tasks', async(req, res) => {
            const taskID = req.query.id;
            const newCompletionStatus = req.query.complete === 'true' ? true : false;''
            try {
                const dbQuery = { _id: new ObjectId(taskID) };
                
                const updateResult = await tasksCollection.updateOne(dbQuery , {
                    $set: { completed: newCompletionStatus }
                })
                
                
                res.json(`Set task with id ${taskID} to complete status of ${newCompletionStatus}`);
                
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