import dotenv from 'dotenv';
import express from 'express';
import mongodb from 'mongodb';

dotenv.config();

const { MongoClient, ObjectId } = mongodb;
const app = express();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.get('/api/products', async (request, response) => {
  try {
    const db = client.db('BitShop');
    const productsCollection = db.collection('Products');

    const products = await productsCollection.find().toArray();
    response.json(products);
  } catch (err) {
    console.error(err);
    response.status(500).send('Error connecting to the database');
  }
});

app.delete('/api/products/:productId', async (request, response) => {
  try {
    const { productId } = request.params;
    const db = client.db('BitShop');
    const productsCollection = db.collection('Products');

    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
    if (result.deletedCount === 0) {
      response.status(404).send('Product not found');
    } else {
      response.status(204).send();
    }
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
      app.listen(5000, () => {
        console.log('The server was started on port 5000');
        console.log('To stop the server, press "CTRL + C"');
      });
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
})();
