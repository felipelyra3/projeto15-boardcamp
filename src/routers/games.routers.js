import express from "express";
import { GetGames, PostGames } from "../controllers/games.controllers.js";

const router = express.Router();

router.get('/games', GetGames);
router.post('/games', PostGames);

export default router;