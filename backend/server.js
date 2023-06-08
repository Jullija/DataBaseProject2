import dotenv from 'dotenv';
import express from 'express';
import mongodb from 'mongodb';
import session from 'express-session';
import {hashPassword, verifyPassword} from './module/password.js';
"use strict"



dotenv.config();

const {MongoClient, ObjectId} = mongodb;
const app = express();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, saveUninitialized: true, cookie: {secure: false} // Set to 'true' in production when using HTTPS
}));

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

app.post('/api/products', async (request, response) => {
    
    const { product_name, product_price, product_type,image_link, product_description  } = request.body;

    if (!product_name|| !product_price || !product_type|| !image_link || !product_description) {
        response.status(400).send('you need to fill out form before adding to database');
        return;
    }
    try {
     
      const db = client.db('BitShop');
      const productsCollection = db.collection('Products');
      const maxIdProduct = await productsCollection.aggregate([
        { $sort: { product_id: -1 } },
        { $limit: 1 }
      ]).toArray();
      
      const product_id = maxIdProduct[0].product_id + 1;
  
      const newProduct = {
        product_name,
        product_id,
        product_price,
        product_type,
        product_description,
        image_link
      };
    //   console.log(newProduct);
  
    const result = await productsCollection.insertOne(newProduct);
    // console.log(result);
    const addedProduct = await productsCollection.findOne({_id: result.insertedId});
    response.status(201).json(addedProduct);

    } catch (err) {
      console.error(err);
      response.status(500).send('Error connecting to the database');
    }
  });

app.post('/api/users/buy/:name', async (request, response) => {

    

    const { product_id, product_quantity,user_id } = request.body;
    
    // console.log(request.body)
    // console.log(product_id, user_id, product_quantity)

    if (!product_id|| !user_id || !product_quantity) {
        // console.log(product_id, user_id, product_quantity)
        response.status(400).send('you need to fill out form before adding to database');
        return;
    }
    try {
     
      const db = client.db('BitShop');
      const productsCollection = db.collection('Products');
      const basketProduct = await productsCollection.findOne(
        {_id: new ObjectId(product_id)},
        { product_id: 1,
            product_name: 1,
            product_price: 1,
            product_type: 1,
            product_description: 0,
            quantity: 1, }
      );
      if (basketProduct) {
        basketProduct.date= new Date();
      }
      
    console.log(basketProduct);
    const userCollection = db.collection('Users');
    // Update basket
    const result = await userCollection.updateOne({_id: new ObjectId(user_id)},{$push:{basket:basketProduct}})

    // console.log(result);
    response.status(201).json(result);

    } catch (err) {
      console.error(err);
      response.status(500).send('Error connecting to the database');
    }
  });


app.post('/api/users/signup', async (request, response) => {
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

app.post('/api/users/login', async (request, response) => {
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

app.get('/api/users/current', async (request, response) => {
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

app.post('/api/users/logout', (request, response) => {
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

app.patch('/api/products/:productId', async (request, response) => {
    console.log('PATCH /api/products/:productId');
    const { productId } = request.params;
    const updateObject = request.body;

    if (!updateObject || typeof updateObject !== 'object' || Object.keys(updateObject).length === 0 ) 
    {
        response.status(400).send('You must provide an object to update the product');
        return;
    }

    try {
        const db = client.db('BitShop');
        const productsCollection = db.collection('Products');

        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
        if (!product) {
            response.status(404).send('Product not found');
            return;
        }

        // If the update object includes product_quantity, do a quantity check
        if (updateObject.product_quantity) {
            const newQuantity = product.product_quantity + updateObject.product_quantity;
            updateObject.product_quantity = Math.max(0,newQuantity);
        }
        // console.log(updateObject);
        // console.log(product);

        await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: updateObject }
        );
        // console.log(updateObject);
        // console.log(product);

        response.status(200).send(updateObject);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

app.get('/api/users/:userId/basket', async (request, response) => {
    try {
        const {userId} = request.params;
        const db = client.db('BitShop');
        const usersCollection = db.collection('Users');

        const user = await usersCollection.findOne({_id: new ObjectId(userId)});
        if (!user) {
            response.status(404).send('User not found');
            return;
        }

        if (!user.basket) {
            response.status(404).send('Basket not found');
            return;
        }

        response.status(200).json(user.basket);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error connecting to the database');
    }
});

app.post('/api/users/purchase/:userId', async (request, response) => {
    try {
      const {userId} = request.params;
      const {basket, history} = request.body;
      const db = client.db('BitShop');
      const usersCollection = db.collection('Users');
  
      // Find the user with the provided ID
      const user = await usersCollection.findOne({_id: new ObjectId(userId)});
      if (!user) {
        response.status(404).send('User not found');
        return;
      }
  
      // Update user's basket and history
      const updateResult = await usersCollection.updateOne(
        {_id: new ObjectId(userId)},
        {
          $set: {
            basket: basket,
          },
          $push: {
            history: {$each: history},
          },
        }
      );
  
      if (updateResult.modifiedCount === 0) {
        response.status(404).send('Failed to update user');
        return;
      }
  
      response.status(200).send('Purchase successful');
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
