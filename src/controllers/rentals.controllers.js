import connection from '../database/db.js';
import Joi from "joi";
import dayjs from 'dayjs';

//GetRentals
async function GetRentals(req, res) {
    if (req.query.customerid) {
        const search = (await connection.query(`SELECT * FROM rentals JOIN customers ON "customerId" = customers.id JOIN games ON "gameId" = games.id WHERE rentals.id = $1;`, [req.query.customerid])).rows;
        if (search.length === 0) {
            res.sendStatus(404);
            return;
        }
        res.send(search);
        return;
    }

    if (req.query.gameid) {
        const search = (await connection.query(`SELECT * FROM rentals JOIN customers ON "customerId" = customers.id JOIN games ON "gameId" = games.id WHERE games.id = $1;`, [req.query.gameid])).rows;
        if (search.length === 0) {
            res.sendStatus(404);
            return;
        }
        res.send(search);
        return;
    }

    try {
        const rentals = (await connection.query(`SELECT * FROM rentals JOIN customers ON "customerId" = customers.id JOIN games ON "gameId" = games.id;`)).rows;
        res.send(rentals);
    } catch (error) {
        console.log(error);
    }
};

//PostRentals
//Schema PostRentals
const postRentals = Joi.object({
    customerId: Joi.number().required(),
    gameId: Joi.number().required(),
    daysRented: Joi.number().min(1)
});
async function PostRentals(req, res) {
    try {
        await postRentals.validateAsync(req.body);
        const games = (await connection.query(`SELECT * FROM games;`)).rows;
        const nGames = (await connection.query(`SELECT COUNT(*) FROM games;`)).rows;
        const customers = (await connection.query(`SELECT * FROM customers`)).rows;
        const nCustomers = (await connection.query(`SELECT COUNT(*) FROM customers`)).rows;
        const nRentedGame = (await connection.query(`SELECT COUNT(*) FROM rentals WHERE "gameId" = $1;`, [req.body.gameId])).rows;

        if (games.stockTotal < nRentedGame[0].count) {
            res.sendStatus(400);
        }

        let flag = 0;
        for (let i = 0; i < nGames[0].count; i++) {
            if (req.body.gameId === games[i].id) {
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            res.sendStatus(400);
            return;
        }

        flag = 0;
        for (let i = 0; i < nCustomers[0].count; i++) {
            if (req.body.customerId === customers[i].id) {
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            res.sendStatus(400);
            return;
        }

        const game = (await connection.query(`SELECT "pricePerDay" FROM games WHERE id = ${req.body.gameId};`)).rows;
        //const originalPrice = req.body.daysRented * game[0].pricePerDay;
        const originalPrice = 0;

        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") values($1, $2, CURRENT_DATE, $3, null, ${originalPrice}, null);`, [req.body.customerId, req.body.gameId, req.body.daysRented]);

        res.sendStatus(201);
    } catch (error) {
        res.status(422).send(error.message);
    }
};

//PostRentalsReturnByID
async function PostRentalsReturnById(req, res) {
    try {
        const rentals = (await connection.query(`SELECT * FROM rentals;`)).rows;
        const rentalsById = (await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [req.params.id])).rows;
        const nRentals = (await connection.query(`SELECT COUNT(*) FROM rentals;`)).rows;

        //Verifies if rent id exists
        let flag = 0;
        for (let i = 0; i < nRentals[0].count; i++) {
            if (req.params.id == rentals[i].id) {
                flag = 1;
            }
        }
        if (flag === 0) {
            res.sendStatus(404);
            return;
        }

        //Verifies if the rent is already finished
        flag = 0
        for (let i = 0; i < nRentals[0].count; i++) {
            if (rentals[i].returnDate === null) {
                flag = 1;
            }
        }
        if (flag === 0) {
            res.sendStatus(400);
            return;
        }

        const today = dayjs().format('YYYY-MM-DD');
        const rentDatePlusDaysRented = (dayjs(rentalsById[0].rentDate).add(rentalsById[0].daysRented, 'day')).$d;
        const nDelayFee = dayjs(today).diff(rentDatePlusDaysRented, 'day');
        const delayFee = (nDelayFee * rentalsById[0].originalPrice);
        await connection.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 where id = $3`, [today, delayFee, req.params.id]);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
};

//DeleteRentalsById
async function DeleteRentalsById(req, res) {
    try {
        const rentals = (await connection.query(`SELECT * FROM rentals;`)).rows;
        const nRentals = (await connection.query(`SELECT COUNT(*) FROM rentals;`)).rows;
        const rentalsById = (await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [req.params.id])).rows;

        //Verifies if rent id exists
        let flag = 0;
        for (let i = 0; i < nRentals[0].count; i++) {
            if (req.params.id == rentals[i].id) {
                flag = 1;
            }
        }
        if (flag === 0) {
            res.sendStatus(404);
            return;
        }

        //Verifies if the rent is already finished
        if (rentalsById[0].returnDate === null) {
            res.sendStatus(400);
            return;
        }

        await connection.query(`DELETE FROM rentals WHERE id = $1`, [req.params.id]);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
};

export { GetRentals, PostRentals, PostRentalsReturnById, DeleteRentalsById };