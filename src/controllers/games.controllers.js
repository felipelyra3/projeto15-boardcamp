import connection from '../database/db.js';
import Joi from "joi";

//GetGames
async function GetGames(req, res) {
    if (req.query.name) {
        const search = (await connection.query(`SELECT * FROM games WHERE name ILIKE '${req.query.name}%';`)).rows;
        res.status(200).send(search);
        return;
    }

    try {
        const games = (await connection.query('SELECT * FROM games;')).rows;
        res.status(200).send(games);
    } catch (error) {
        console.log(error);
    }
};

//Schemas
const postGames = Joi.object({
    name: Joi.string().empty().required(),
    image: Joi.string(),
    stockTotal: Joi.number().positive(),
    pricePerDay: Joi.number().positive(),
    categoryId: Joi.number().min(1)
});

//PostGames
async function PostGames(req, res) {
    try {
        /* await postGames.validateAsync(req.body);
        const nCategories = (await connection.query(`SELECT COUNT(*) FROM categories;`)).rows;
        const categories = (await connection.query(`select row_number() over() from categories;`)).rows;
        const games = (await connection.query(`SELECT * FROM games;`)).rows;
        const nGames = (await connection.query(`SELECT COUNT(*) FROM games;`)).rows;

        //Verify if exists a game with the same name
        for (let i = 0; i < nGames[0].count; i++) {
            if (req.body.name === games[0].name) {
                res.sendStatus(409);
                return;
            }
        }

        //Verify if categoryId exists in categories table
        let flag = 0;
        for (let i = 0; i < nCategories[0].count; i++) {
            if (req.body.categoryId === categories[0].row_number) {
                flat = 1;
                break;
            }
        }
        if (flag === 0) {
            res.sendStatus(400);
            return;
        } */

        await postGames.validateAsync(req.body);
        const nCategories = (await connection.query(`SELECT COUNT(*) FROM categories;`)).rows;
        const categories = (await connection.query(`select * from categories;`)).rows;
        const games = (await connection.query(`SELECT * FROM games;`)).rows;
        const nGames = (await connection.query(`SELECT COUNT(*) FROM games;`)).rows;

        //Verify if exists a game with the same name
        for (let i = 0; i < nGames[0].count; i++) {
            if (req.body.name === games[i].name) {
                res.sendStatus(409);
                return;
            }
        }

        //Verify if categoryId exists in categories table
        let flag = 0;
        for (let i = 0; i < nCategories[0].count; i++) {
            if (req.body.categoryId === categories[i].id) {
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            res.sendStatus(400);
            return;
        }

        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES($1, $2, $3, $4, $5);`, [req.body.name, req.body.image, req.body.stockTotal, req.body.categoryId, req.body.pricePerDay]);

        res.sendStatus(201);
        //res.send(nCategories[0].count);
    } catch (error) {
        console.log(error)
        res.status(422).send(error.message);
    }
};

export { GetGames, PostGames };