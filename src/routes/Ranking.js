import express from "express";

import errors from "../const/errors.js";
import { getRanking } from "../controllers/Ranking.js";

const router = express.Router();

router.all("/ranking", async (req, res) => {
    if (req.method === "GET") return await getRanking(req, res);
    return res.status(errors[405].code).send(errors[405]);
});

export default router;