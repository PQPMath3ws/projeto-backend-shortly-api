import express from "express";

import errors from "../const/errors.js";
import { getUserInfo } from "../controllers/Users.js";
import { isAuthenticated } from "../middlewares/Authentication.js";

const router = express.Router();

router.all("/users/me", isAuthenticated, async (req, res) => {
    if (req.method === "GET") return await getUserInfo(req, res);
    return res.status(errors[405].code).send(errors[405]);
});

export default router;