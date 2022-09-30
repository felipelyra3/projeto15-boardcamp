import express from "express";
import { GetCustomers, GetCustomersById } from "../controllers/customers.controllers.js";

const router = express.Router();

router.get('/customers', GetCustomers);
router.get('/customers/:id', GetCustomersById);


export default router;