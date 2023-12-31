const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
////K5kGZ2Aa7fIdEF7w
////ToysManagement

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z0a0ula.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const ToysCollection = client.db("ToysManagement").collection("ToysData");

    // const indexKeys = { category: 1, Toyname: 1 }; // Replace field1 and field2 with your actual field names
    // const indexOptions = { name: "ToyCategory" }; // Replace index_name with the desired index name
    // const result = await ToysCollection.createIndex(indexKeys, indexOptions);

    // app.get("/ShopsCategoryCollection", async (req, res) => {
    //   const result = await ShopCategoryCollection.find().toArray();
    //   res.send(result);
    // });

    app.get("/myToys/:email", async (req, res) => {
      // console.log(req.params.email);
      const jobs = await ToysCollection.find({
        email: req.params.email,
      })
        .sort({ price: -1 })
        .toArray();
      res.send(jobs);
    });

    app.get("/ToysData", async (req, res) => {
      const result = await ToysCollection.find().limit(20).toArray();
      res.send(result);
    });

    app.get("/ToysData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ToysCollection.findOne(query);
      res.send(result);
    });
    // Insert
    app.post("/ToysData", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await ToysCollection.insertOne(booking);
      res.send(result);
    });
    // Update
    app.put("/ToysData/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToys = req.body;

      const Toys = {
        $set: {
          quantity: updatedToys.quantity,
          price: updatedToys.price,
          details: updatedToys.details,
        },
      };

      const result = await ToysCollection.updateOne(filter, Toys, options);
      res.send(result);
    });
    // Delete
    app.delete("/ToysData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ToysCollection.deleteOne(query);
      res.send(result);
    });

    // Search Bar
    app.get("/getJobsByText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await ToysCollection.find({
        $or: [
          { category: { $regex: text, $options: "i" } },
          { Toyname: { $regex: text, $options: "i" } },
        ],
      }).toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toys Management!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
