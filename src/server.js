import express from "express";
import pg from 'pg';
import Joi from "joi";

const { Pool } = pg;
const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'boardcamp'
});

const server = express();
server.use(express.json());

////////// Categories //////////
const postCategories = Joi.object({
    name: Joi.string().empty().required()
});

server.get('/categories', async (req, res) => {
    const categories = await connection.query(`SELECT * FROM categories;`);
    res.status(200).send(categories.rows);
});

server.post('/categories', async (req, res) => {
    try {
        await postCategories.validateAsync(req.body);
        await connection.query(`INSERT INTO categories (name) values($1);`, [req.body.name]);
        res.sendStatus(201);
    } catch (error) {
        res.status(422).send(error.message);
    }
});

////////// INTERNAL //////////
server.get('/', async (req, res) => {
    res.send(req.body);
});

////////// Server listen //////////
server.listen(4000, () => {
    console.log("Server running on port " + 3000);
});