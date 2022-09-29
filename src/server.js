import express from "express";
import pg from 'pg';

const { Pool } = pg;
const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'postgres'
});

const server = express();

server.get('/', async (req, res) => {
    const clientes = await connection.query('SELECT * FROM produtos');
    //console.log(clientes);
    res.send(clientes.rows);
});

server.get('/test', (req, res) => {
    res.send('AAAAA');
});

////////// Server listen //////////
server.listen(4000, () => {
    console.log("Server running on port " + 3000);
});