import express from "express";
import { GetCategories, PostCategories } from "../controllers/products.controllers.js";

const router = express.Router();

router.get('/categories', GetCategories);
router.post('/categories', PostCategories);

export default router;