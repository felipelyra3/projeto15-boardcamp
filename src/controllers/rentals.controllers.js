import connection from '../database/db.js';
import Joi from "joi";
import dayjs from 'dayjs';

//GetRentals
async function GetRentals(req, res) {
    const object = [];

    try {
        //Get by customer ID
        if (req.query.customerid) {
            const rentals = (await connection.query(`SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId" = $1;`, [req.query.customerid])).rows;
            if (rentals.length === 0) {
                res.sendStatus(404);
                return;
            }

            const nRentals = (await connection.query('SELECT COUNT(*) FROM rentals WHERE "customerId" = $1;', [req.query.customerid])).rows;
            for (let i = 0; i < nRentals[0].count; i++) {
                let rentDate;
                let returnDate;
                if (rentals[i].rentDate !== null) {
                    rentDate = (rentals[i].rentDate).getFullYear() + "-" + ("0" + (rentals[i].rentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + rentals[i].rentDate.getDate()).slice(-2);
                } else {
                    rentDate = null;
                }

                if (rentals[i].returnDate !== null) {
                    returnDate = (rentals[i].returnDate).getFullYear() + "-" + ("0" + (rentals[i].returnDate.getMonth() + 1)).slice(-2) + "-" + ("0" + rentals[i].returnDate.getDate()).slice(-2);
                } else {
                    returnDate = null;
                }

                const allRentals = {
                    id: rentals[i].id,
                    customerId: rentals[i].customerId,
                    gameId: rentals[i].gameId,
                    rentDate: rentDate,
                    daysRented: rentals[i].daysRented,
                    returnDate: returnDate,
                    originalPrice: rentals[i].originalPrice,
                    delayFee: rentals[i].delayFee,
                    customer: {
                        id: rentals[i].customer.id,
                        name: rentals[i].customer.name
                    },
                    game: {
                        id: rentals[i].game.id,
                        name: rentals[i].game.name,
                        categoryId: rentals[i].game.categoryId,
                        categoryName: rentals[i].game.categoryName
                    }
                };
                object.push(allRentals);
            }

            res.send(object);
            return;
        }

        //Get by game ID
        if (req.query.gameid) {
            const rentals = (await connection.query(`SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."gameId" = $1;`, [req.query.gameid])).rows;
            if (rentals.length === 0) {
                res.sendStatus(404);
                return;
            }

            const nRentals = (await connection.query('SELECT COUNT(*) FROM rentals WHERE "gameId" = $1;', [req.query.gameid])).rows;
            for (let i = 0; i < nRentals[0].count; i++) {
                let rentDate;
                let returnDate;
                if (rentals[i].rentDate !== null) {
                    rentDate = (rentals[i].rentDate).getFullYear() + "-" + ("0" + (rentals[i].rentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + rentals[i].rentDate.getDate()).slice(-2);
                } else {
                    rentDate = null;
                }

                if (rentals[i].returnDate !== null) {
                    returnDate = (rentals[i].returnDate).getFullYear() + "-" + ("0" + (rentals[i].returnDate.getMonth() + 1)).slice(-2) + "-" + ("0" + rentals[i].returnDate.getDate()).slice(-2);
                } else {
                    returnDate = null;
                }

                const allRentals = {
                    id: rentals[i].id,
                    customerId: rentals[i].customerId,
                    gameId: rentals[i].gameId,
                    rentDate: rentDate,
                    daysRented: rentals[i].daysRented,
                    returnDate: returnDate,
                    originalPrice: rentals[i].originalPrice,
                    delayFee: rentals[i].delayFee,
                    customer: {
                        id: rentals[i].customer.id,
                        name: rentals[i].customer.name
                    },
                    game: {
                        id: rentals[i].game.id,
                        name: rentals[i].game.name,
                        categoryId: rentals[i].game.categoryId,
                        categoryName: rentals[i].game.categoryName
                    }
                };
                object.push(allRentals);
            }

            res.send(object);
            return;
        }

        //Get all
        const rentals = (await connection.query('SELECT rentals.*, json_agg(customers.*) AS customer, json_agg(games.*) AS game, json_agg(categories.name) AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id GROUP BY rentals.id;')).rows;
        const nRentals = (await connection.query('SELECT COUNT(*) FROM rentals;')).rows;
        for (let i = 0; i < nRentals[0].count; i++) {
            let rentDate;
            let returnDate;
            if (rentals[i].rentDate !== null) {
                rentDate = (rentals[i].rentDate).getFullYear() + "-" + ("0" + (rentals[i].rentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + rentals[i].rentDate.getDate()).slice(-2);
            } else {
                rentDate = null;
            }

            if (rentals[i].returnDate !== null) {
                returnDate = (rentals[i].returnDate).getFullYear() + "-" + ("0" + (rentals[i].returnDate.getMonth() + 1)).slice(-2) + "-" + ("0" + rentals[i].returnDate.getDate()).slice(-2);
            } else {
                returnDate = null;
            }

            const allRentals = {
                id: rentals[i].id,
                customerId: rentals[i].customerId,
                gameId: rentals[i].gameId,
                rentDate: rentDate,
                daysRented: rentals[i].daysRented,
                returnDate: returnDate,
                originalPrice: rentals[i].originalPrice,
                delayFee: rentals[i].delayFee,
                customer: {
                    id: rentals[i].customer[0].id,
                    name: rentals[i].customer[0].name
                },
                game: {
                    id: rentals[i].game[0].id,
                    name: rentals[i].game[0].name,
                    categoryId: rentals[i].game[0].categoryId,
                    categoryName: rentals[i].categoryName[0]
                }
            };
            object.push(allRentals);
        }

        res.send(object);
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
        const gameById = (await connection.query(`select * from games where id = $1;`, [req.body.gameId])).rows;
        const customers = (await connection.query(`SELECT * FROM customers;`)).rows;
        const nCustomers = (await connection.query(`SELECT COUNT(*) FROM customers;`)).rows;
        const nRentedGame = (await connection.query(`SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null;`, [req.body.gameId])).rows;

        if (gameById[0].stockTotal <= nRentedGame[0].count) {
            res.sendStatus(400);
            return;
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

        const originalPrice = req.body.daysRented * gameById[0].pricePerDay;
        //const originalPrice = 0;

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