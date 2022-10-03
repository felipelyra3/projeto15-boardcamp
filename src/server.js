import express from "express";
import cors from 'cors';
import pg from 'pg';
import Joi from "joi";
import connection from './database/db.js';
import categories from './routers/products.routers.js';
import games from './routers/games.routers.js';
import customers from './routers/customers.routes.js';
import rentals from './routers/rentals.routers.js';

/* const { Pool } = pg;
const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'boardcamp'
}); */

const server = express();
server.use(cors());
server.use(express.json());

////////// Categories //////////
server.use(categories);

////////// Games //////////
server.use(games);

////////// Customers //////////
server.use(customers);

////////// Rentals //////////
server.use(rentals);

////////// INTERNAL //////////
server.get('/', async (req, res) => {
    const name = (await connection.query('SELECT name from categories where id = 1;')).rows[0].name;
    res.send(name);
});

////////// Server listen //////////
server.listen(4000, () => {
    console.log("Server running on port " + 3000);
});