import express from 'express';
import mongodb from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const {MongoClient, ObjectId} = mongodb;
const productRouter = express.Router();
const client = new MongoClient(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

productRouter.get('/', async (request, response) => {
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

productRouter.delete('/:productId', async (request, response) => {
    try {
        const {productId} = request.params;
        const db = client.db('BitShop');
        const productsCollection = db.collection('Products');

        const result = await productsCollection.deleteOne({_id: new ObjectId(productId)});
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

productRouter.post('/', async (request, response) => {
    const {product_name, product_price, product_type, image_link, product_description, product_quantity} = request.body;

    if (!product_name || !product_price || !product_type || !image_link || !product_description || !product_quantity) {
        response.status(400).send('you need to fill out form before adding to database');
        return;
    }
    try {
        const db = client.db('BitShop');
        const productsCollection = db.collection('Products');
        const product_quantity_parsed = parseInt(product_quantity);
        const product_price_parsed = parseFloat(product_price);

        const newProduct = {
            product_name,
            product_id,
            product_price_parsed,
            product_type,
            product_description,
            product_quantity_parsed,
            image_link
        };

        const result = await productsCollection.insertOne(newProduct);
        const addedProduct = await productsCollection.findOne({_id: result.insertedId});
        response.status(201).json(addedProduct);

    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

productRouter.patch('/:productId', async (request, response) => {
    const {productId} = request.params;
    const updateObject = request.body;

    if (!updateObject || typeof updateObject !== 'object' || Object.keys(updateObject).length === 0) {
        response.status(400).send('You must provide an object to update the product');
        return;
    }

    try {
        const db = client.db('BitShop');
        const productsCollection = db.collection('Products');

        const product = await productsCollection.findOne({_id: new ObjectId(productId)});
        if (!product) {
            response.status(404).send('Product not found');
            return;
        }

        if (updateObject.product_quantity) {
            const newQuantity = product.product_quantity + updateObject.product_quantity;
            updateObject.product_quantity = Math.max(0, newQuantity);
        }

        await productsCollection.updateOne({_id: new ObjectId(productId)}, {$set: updateObject});

        response.status(200).send(updateObject);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

productRouter.get('/sort', async (request, response) => {
    console.log(request.query);
    const strategy = request.query;

    if (!strategy) {
        response.status(400).send('You must provide an object to update the product');
        return;
    }
    try {
        const db = client.db('BitShop');
        const productsCollection = db.collection('Products');

        const products = await productsCollection.find().sort(strategy).toArray();
        response.json(products);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }

});
productRouter.get('/match', async (request, response) => {
    console.log(request.query);
    const strategy = JSON.parse(request.query.strategy);

    if (!strategy) {
        response.status(400).send('You must provide an object to update the product');
        return;
    }
    try {
        const db = client.db('BitShop');
        const productsCollection = db.collection('Products');
        const products = await productsCollection.find(strategy).toArray();
        console.log(products);
        response.json(products);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }

});

export default productRouter;
