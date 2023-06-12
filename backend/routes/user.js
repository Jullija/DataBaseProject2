import express from 'express';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import {hashPassword, verifyPassword} from '../module/password.js';

dotenv.config();

const {MongoClient, ObjectId} = mongodb;
const usersRouter = express.Router();
const client = new MongoClient(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

usersRouter.post('/signup', async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        response.status(400).send('Full name, email, and password are required for sign up');
        return;
    }

    try {
        const db = client.db('BitShop');
        const usersCollection = db.collection('Users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            response.status(409).send('An account with this email already exists');
            return;
        }

        const hashedPassword = await hashPassword(password);
        const newUser = {
            name,
            email,
            password: hashedPassword,
        };

        const result = await usersCollection.insertOne(newUser);
        request.session.userId = result.insertedId;
        response.status(201).json(result.ops[0]);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

usersRouter.post('/login', async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        response.status(400).send('Email and password are required for login');
        return;
    }

    try {
        const db = client.db('BitShop');
        const usersCollection = db.collection('Users');

        const user = await usersCollection.findOne({ email });
        if (!user) {
            response.status(404).send('User not found');
            return;
        }

        const isPasswordCorrect = await verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            response.status(401).send('Invalid password');
            return;
        }

        request.session.userId = user._id;
        response.status(200).json(user);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

usersRouter.get('/current', async (request, response) => {
    if (!request.session.userId) {
        response.status(401).send('No user is currently logged in');
        return;
    }

    try {
        const db = client.db('BitShop');
        const usersCollection = db.collection('Users');

        const user = await usersCollection.findOne({_id: new ObjectId(request.session.userId)});
        if (!user) {
            response.status(404).send('User not found');
            return;
        }

        response.status(200).json(user);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

usersRouter.post('/logout', (request, response) => {
    if (!request.session.userId) {
        response.status(400).send('No user is currently logged in');
        return;
    }

    request.session.destroy((err) => {
        if (err) {
            console.error(err);
            response.status(500).send('Error logging out');
        } else {
            response.status(200).send('Logged out successfully');
        }
    });
});

usersRouter.post('/buy/:name', async (request, response) => {
    const { product_id, product_name, product_price } = request.body;

    try {
        const db = client.db('BitShop');
        const usersCollection = db.collection('Users');
        const productsCollection = db.collection('Products');

        const user = await usersCollection.findOne({_id: new ObjectId(request.session.userId)});
        if (!user) {
            response.status(404).send('User not found');
            return;
        }

        const product = await productsCollection.findOne({_id: new ObjectId(product_id)});
        if (!product) {
            response.status(404).send('Product not found');
            return;
        }

        const updatedUser = await usersCollection.updateOne({_id: new ObjectId(request.session.userId)}, {$push: {basket: {product_id, product_name, product_price}}});
        response.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

usersRouter.get('/:userId/basket', async (request, response) => {
    try {
        const db = client.db('BitShop');
        const usersCollection = db.collection('Users');

        const user = await usersCollection.findOne({_id: new ObjectId(request.params.userId)});
        if (!user) {
            response.status(404).send('User not found');
            return;
        }

        response.status(200).json(user.basket);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

usersRouter.post('/purchase/:userId', async (request, response) => {
    const { products } = request.body;

    try {
        const db = client.db('BitShop');
        const usersCollection = db.collection('Users');
        const purchasesCollection = db.collection('Purchases');

        const user = await usersCollection.findOne({_id: new ObjectId(request.params.userId)});
        if (!user) {
            response.status(404).send('User not found');
            return;
        }

        const purchase = {
            userId: request.params.userId,
            products
        };

        const result = await purchasesCollection.insertOne(purchase);
        response.status(201).json(result.ops[0]);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

export default usersRouter;
