import express from "express";
import { GetRentals, PostRentals, PostRentalsReturnById, DeleteRentalsById } from "../controllers/rentals.controllers.js";

const router = express.Router();

router.get('/rentals', GetRentals);
router.post('/rentals', PostRentals);
router.post('/rentals/:id/return', PostRentalsReturnById);
router.delete('/rentals/:id', DeleteRentalsById);

export default router;