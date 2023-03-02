import express from "express";

import errors from "../const/errors.js";
import { signUp } from "../controllers/Sign.js";

const router = express.Router();

router.all("/signup", async (req, res) => {
    if (req.method === "POST") return await signUp(req, res);
    return res.status(errors[405].code).send(errors[405]);
});

export default router;