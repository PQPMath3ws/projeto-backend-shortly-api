import express from "express";

import errors from "../const/errors.js";
import { shortUrl } from "../controllers/Urls.js";
import { isAuthenticated } from "../middlewares/Authentication.js";

const router = express.Router();

router.all("/urls/shorten", isAuthenticated, async (req, res) => {
    if (req.method === "POST") return await shortUrl(req, res);
    return res.status(errors[405].code).send(errors[405]);
});

export default router;