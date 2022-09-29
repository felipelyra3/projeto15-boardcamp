import express from "express";
import pg from 'pg';

const { Pool } = pg;
const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'boardcamp'
});

const server = express();

////////// Categories //////////
server.get('/categories', async (req, res) => {
    const categories = await connection.query(`SELECT * FROM categories;`);
    res.status(200).send(categories.rows);
});

server.post('/categories', async (req, res) => {

});

////////// INTERNAL //////////

////////// Server listen //////////
server.listen(4000, () => {
    console.log("Server running on port " + 3000);
});