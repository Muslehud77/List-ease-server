const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//middlewares
app.use(cors());
app.use(express.json());




  const client = new MongoClient(process.env.DBuri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
    //   await client.connect();
    
      const taskCollection = client.db("ListEase").collection("TaskCollection");


      //post new task
      app.post("/add-task",async (req, res) => {
        const task = req.body
        const result = await taskCollection.insertOne(task)
        res.send(result);
        
      })

      //get list by task
      app.get("/all-tasks/:task/:user",async (req, res) => {
        const task = req.params.task
        const user = req.params.user
        const result = await taskCollection.find({task,user}).toArray()
        
       res.send(result);
        
        
      })

      //get task by id
      app.get("/task/:id",async (req, res) => {
        const id = {_id: new ObjectId(req.params.id)}
       
        const result = await taskCollection.findOne(id)

       res.send(result);
        
        
      })

      //patch task 
      app.patch("/edit-task/:id",async (req, res) => {
        const id = {_id: new ObjectId(req.params.id)}
        
        const task = req.body


        const result = await taskCollection.updateOne(id,{$set:task})


       res.send(result);
        
        
      })





    
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);








app.get("/", (req, res) => {
  res.send(`ListEase is listening on port ${port}`);
});
app.listen(port, () => {
  console.log(`ListEase is listening on port ${port}`);
});