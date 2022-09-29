import express from "express";
import pg from 'pg';

const { Pool } = pg;


try {
    const connection = await new Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '123456',
        database: 'postgres'
    });
} catch (error) {
    console.log(error);
}

export default connection;