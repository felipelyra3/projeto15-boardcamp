import connection from '../database/db.js';
import Joi from "joi";

async function GetCustomers(req, res) {
    if (req.query.cpf) {
        const search = (await connection.query(`SELECT * FROM customers WHERE cpf ILIKE '${req.query.cpf}%';`)).rows;
        res.send(search);
        return;
    }

    try {
        const customers = (await connection.query(`SELECT * FROM customers;`)).rows;
        res.send(customers);
    } catch (error) {
        console.log(error);
    }
};

async function GetCustomersById(req, res) {
    try {
        const customers = (await connection.query(`SELECT * FROM customers WHERE id = ${req.params.id};`)).rows;

        if (customers.length === 0) {
            res.sendStatus(404);
            return;
        }

        res.send(customers);
    } catch (error) {
        console.log(error);
    }
};

export { GetCustomers, GetCustomersById };