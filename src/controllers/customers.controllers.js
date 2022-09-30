import connection from '../database/db.js';
import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

//GetCustomers
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

//GetCustomersById
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

//PostCustomers
//Schema PostCustomers
const postCustomers = Joi.object({
    name: Joi.string().empty(),
    phone: Joi.string().regex(/^[0-9]+$/).min(10).max(11),
    cpf: Joi.string().regex(/^[0-9]+$/).min(11).max(11),
    birthday: Joi.date().format('YYYY-MM-DD').utc()
});

async function PostCustomers(req, res) {
    try {
        await postCustomers.validateAsync(req.body);
        const nCustomers = (await connection.query(`SELECT COUNT(*) FROM customers;`)).rows;
        const customers = (await connection.query(`SELECT * FROM customers;`)).rows;
        for (let i = 0; i < nCustomers[0].count; i++) {
            if (req.body.cpf === customers[i].cpf) {
                res.sendStatus(409);
                return;
            }
        }
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) values($1, $2, $3, $4)`, [req.body.name, req.body.phone, req.body.cpf, req.body.birthday]);
        res.sendStatus(201);
    } catch (error) {
        res.status(422).send(error.message);
    }
};

//PutCustomers
//Schema
const putCustomers = Joi.object({
    name: Joi.string().empty(),
    phone: Joi.string().regex(/^[0-9]+$/).min(10).max(11),
    cpf: Joi.string().regex(/^[0-9]+$/).min(11).max(11),
    birthday: Joi.date().format('YYYY-MM-DD').utc()
});

async function PutCustomers(req, res) {
    try {
        await putCustomers.validateAsync(req.body);
        const nCustomers = (await connection.query(`SELECT COUNT(*) FROM customers;`)).rows;
        const customers = (await connection.query(`SELECT * FROM customers;`)).rows;
        for (let i = 0; i < nCustomers[0].count; i++) {
            if (req.body.cpf === customers[i].cpf) {
                res.sendStatus(409);
                return;
            }
        }
        await connection.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5;`, [req.body.name, req.body.phone, req.body.cpf, req.body.birthday, req.params.id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(422).send(error.message);
    }
};

//PutCustomers with no id
async function PutCustomersWithNoId(req, res) {
    res.sendStatus(404);
}

export { GetCustomers, GetCustomersById, PostCustomers, PutCustomers, PutCustomersWithNoId };