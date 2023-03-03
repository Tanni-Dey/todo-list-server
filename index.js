const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT | 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1tyqf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // collections
    const todosCollection = client.db("jobtask").collection("todos");

    //Get all todos
    app.get("/todos", async (req, res) => {
      const query = {};
      const cursor = todosCollection.find(query);
      const allTodo = await cursor.toArray();
      res.send(allTodo);

      //Post todo
      app.post("/todos", async (req, res) => {
        const newTodo = req.body;
        const addTodo = await todosCollection.insertOne(newTodo);
        res.send(addTodo);
      });
      //delete todo
      app.delete("/todo/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const deleteTodo = await todosCollection.deleteOne(query);
        res.send(deleteTodo);
      });
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("curlistic");
});
app.listen(port, () => {
  console.log("culistic", port);
});
