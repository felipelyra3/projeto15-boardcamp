import Joi from "joi";
import connection from '../database/db.js';

//Schemas
const postCategories = Joi.object({
    name: Joi.string().empty().required()
});

//GET Categories
async function GetCategories(req, res) {
    const categories = await connection.query(`SELECT * FROM categories;`);
    res.status(200).send(categories.rows);
};

//Post Categories
async function PostCategories(req, res) {
    try {
        await postCategories.validateAsync(req.body);
        await connection.query(`INSERT INTO categories (name) values($1);`, [req.body.name]);
        res.sendStatus(201);
    } catch (error) {
        res.status(422).send(error.message);
    }
};

export { GetCategories, PostCategories };