import dotenv from 'dotenv';
import express from 'express';
import mongodb from 'mongodb';
import session from 'express-session';
import productRouter from "./routes/product.js";
import usersRouter from "./routes/user.js";


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

app.use('/api/products', productRouter);
app.use('/api/users', usersRouter);

// rest of your server.js code



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
