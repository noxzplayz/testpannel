const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI || 'mongodb+srv://balekajeyochan:p0rGy82wS1BGj1AD@galxynode.qgzpega.mongodb.net/?retryWrites=true&w=majority&appName=galxynode';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let deliveriesCollection;

async function run() {
  try {
    await client.connect();
    const database = client.db('deliveryDB');
    deliveriesCollection = database.collection('deliveries');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}

run();

// Get all deliveries
app.get('/deliveries', async (req, res) => {
  try {
    const deliveries = await deliveriesCollection.find({}).toArray();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// Add a new delivery
app.post('/deliveries', async (req, res) => {
  try {
    const delivery = req.body;
    const result = await deliveriesCollection.insertOne(delivery);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add delivery' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
