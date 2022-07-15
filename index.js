const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000

// middle wares ------------------- 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t7ino.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log("db connected");


async function run() {
    try {
        await client.connect();
        const studentsCollection = client.db("softnerve").collection("students");
        // Get Api all
        app.get('/students', async (req, res) => {
            const query = {};
            const cursor = studentsCollection.find(query);
            const result =  (await cursor.toArray());
            res.send(result);

        });

        // Post api
        app.post('/students', async (req, res) => {
            const addNew = req.body;
            const result = await studentsCollection.insertOne(addNew);
            res.send(result);
        });
        //Get Api by Id
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await studentsCollection.findOne(query);
            res.send(result);
        });
        //Delete Api 
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await studentsCollection.deleteOne(query);
            res.send(result);
        });
        // Update Api
        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const newStudent = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: newStudent
            };
            const result = await studentsCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        });

        
        
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Softnerve task is running')
});

app.listen(port, () => {
    console.log(`Softnerve listening on port ${port}`)
});