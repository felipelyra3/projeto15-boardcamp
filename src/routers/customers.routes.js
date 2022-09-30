import express from "express";
import { GetCustomers, GetCustomersById, PostCustomers, PutCustomers, PutCustomersWithNoId } from "../controllers/customers.controllers.js";

const router = express.Router();

router.get('/customers', GetCustomers);
router.get('/customers/:id', GetCustomersById);
router.post('/customers', PostCustomers);
router.put('/customers/:id', PutCustomers);
router.put('/customers', PutCustomersWithNoId);


export default router;