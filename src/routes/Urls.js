import express from "express";

import errors from "../const/errors.js";
import { deleteShortUrl, getShortUrl, openShortUrl, shortUrl } from "../controllers/Urls.js";
import { isAuthenticated } from "../middlewares/Authentication.js";

const router = express.Router();

router.all("/urls/shorten", isAuthenticated, async (req, res) => {
    if (req.method === "POST") return await shortUrl(req, res);
    return res.status(errors[405].code).send(errors[405]);
});

router.delete("/urls/:id", isAuthenticated, async (req, res, next) => {
    return await deleteShortUrl(req, res);
});

router.all("/urls/:id", async (req, res) => {
    if (req.method === "GET") return await getShortUrl(req, res);
    return res.status(errors[405].code).send(errors[405]);
});

router.all("/urls/open/:shortUrl", async (req, res) => {
    if (req.method === "GET") return await openShortUrl(req, res);
    return res.status(errors[405].code).send(errors[405]);
});

export default router;