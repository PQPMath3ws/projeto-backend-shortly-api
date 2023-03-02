import { customAlphabet } from "nanoid/async";
import isUrl from "is-url";

import { getPostgresClient, openPostgresClient, releaseClient } from "../config/database.js";
import errors from "../const/errors.js";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 10);

async function getShortUrl(req, res) {
    const { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
        errors["404.2"].message = "invalid id param";
        return res.status(errors["404.2"].code).send(errors["404.2"]);
    }
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        const getShortenUrlQuery = await getPostgresClient().query("SELECT \"id\", \"shorten_url\" AS \"shortUrl\", \"original_url\" AS \"url\" FROM \"shorten_urls\" WHERE \"id\" = $1;", [Number(id)]);
        releaseClient();
        if (getShortenUrlQuery.rows.length === 0) {
            errors["404.2"].message = `shorten url with id ${id} not found`;
            return res.status(errors["404.2"].code).send(errors["404.2"]);
        }
        return res.status(200).send(getShortenUrlQuery.rows[0]);
    });
    return;
}

async function shortUrl(req, res) {
    const { url } = req.body;
    try {
        new URL(url);
        if (!isUrl(url)) {
            releaseClient();
            errors[422].message = "invalid url to shorten";
            return res.status(errors[422].code).send(errors[422]);
        }
        await openPostgresClient(async (error) => {
            if (error) return res.status(errors[500].code).send(errors[500]);
            let shorten_url = null;
            while (true) {
                shorten_url = await nanoid();
                const hasShortenHashQuery = await getPostgresClient().query("SELECT \"id\" FROM \"shorten_urls\" WHERE \"shorten_url\" = $1;", [shorten_url]);
                if (hasShortenHashQuery.rows.length === 0) break;
            }
            const insertedUrlQuery = await getPostgresClient().query("INSERT INTO \"shorten_urls\" (\"shorten_url\", \"original_url\", \"user_id\") VALUES ($1, $2, $3) RETURNING \"id\", \"shorten_url\" AS \"shortUrl\";", [await nanoid(), url, req.authentication.user_id]);
            releaseClient();
            return res.status(200).send(insertedUrlQuery.rows[0]);
        });
        return;
    } catch (_) {
        errors[422].message = "invalid url to shorten";
        return res.status(errors[422].code).send(errors[422]);
    }
}

export { getShortUrl, shortUrl };