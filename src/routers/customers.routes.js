import express from "express";
import { GetCustomers, GetCustomersById, PostCustomers } from "../controllers/customers.controllers.js";

const router = express.Router();

router.get('/customers', GetCustomers);
router.get('/customers/:id', GetCustomersById);
router.post('/customers', PostCustomers);


export default router;