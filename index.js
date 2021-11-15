const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vay9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




async function run() {
  try {
    await client.connect();
    const database = client.db("tour-assistance");
    const placeCollection = database.collection("places");
    const orderCollection = database.collection("orders");

    // POST API
    app.post("/places", async (req, res) => {
      const newPlace = req.body;
      const result = await placeCollection.insertOne(newPlace);
      res.json(result);
    });

    // GET API
    app.get("/places", async (req, res) => {
      const cursor = placeCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // find specific API
    app.get("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await placeCollection.findOne(query);
      res.json(result);
    });

    // DELETE API
    app.delete("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await placeCollection.deleteOne(query);
      res.json(result);
    });

    // POST ORDER API
    app.post("/orders", async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      res.json(result);
    });

    // get Orders API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get my Approve orders API
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const result = await orderCollection.find({ email: email }).toArray();
      res.json(result);
    });

    // DELETE  orders API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          tourName: updateOrder.tourName,
          name: updateOrder.name,
          email: updateOrder.email,
          phone: updateOrder.phone,
          address: updateOrder.address,
          status: updateOrder.status,
          img: updateOrder.img,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
