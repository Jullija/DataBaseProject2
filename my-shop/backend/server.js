const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://127.0.0.1:27017'; // REPLACABLE WITH MONGO URI {CURRENTLY SET FOR LOCALHOST}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.get('/api/products', async function (request, response) {
  try {
    const db = client.db('shop');
    const productsCollection = db.collection('products');

    const products = await productsCollection.find().toArray();
    response.json(products);
  } catch (err) {
    console.error(err);
    response.status(500).send('Error connecting to the database');
  }
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    process.nextTick(() => {
      app.listen(5000, function () {
        console.log('The server was started on port 5000');
        console.log('To stop the server, press "CTRL + C"');
      });
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
})();
