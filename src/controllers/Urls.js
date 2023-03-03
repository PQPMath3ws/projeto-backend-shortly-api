import { customAlphabet } from "nanoid/async";
import isUrl from "is-url";

import { getPostgresClient, openPostgresClient, releaseClient } from "../config/database.js";
import errors from "../const/errors.js";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 10);

async function deleteShortUrl(req, res) {
    const { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
        errors[409].message = "invalid id param";
        return res.status(errors[409].code).send(errors[409]);
    }
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        const getShortenUrlQuery = await getPostgresClient().query("SELECT \"user_id\" FROM \"shorten_urls\" WHERE \"id\" = $1;", [Number(id)]);
        if (getShortenUrlQuery.rows.length === 0) {
            releaseClient();
            errors["404.2"].message = `shorten url with id ${id} not found`;
            return res.status(errors["404.2"].code).send(errors["404.2"]);
        }
        if (getShortenUrlQuery.rows[0].user_id !== req.authentication.user_id) {
            releaseClient();
            return res.status(errors["401.3"].code).send(errors["401.3"]);
        }
        await getPostgresClient().query("DELETE FROM \"shorten_urls\" WHERE \"id\" = $1;", [Number(id)]);
        releaseClient();
        return res.status(204).send();
    });
    return;
}

async function getShortUrl(req, res) {
    const { id } = req.params;
    if (!id || Number.isNaN(Number(id))) {
        errors[409].message = "invalid id param";
        return res.status(errors[409].code).send(errors[409]);
    }
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        const getShortenUrlQuery = await getPostgresClient().query("SELECT \"id\", \"shorten_url\" AS \"shortUrl\", \"original_url\" AS \"url\" FROM \"shorten_urls\" WHERE \"id\" = $1;", [Number(id)]);
        releaseClient();
        if (getShortenUrlQuery.rows.length === 0) {
            errors["404.2"].message = `shorten url with id ${id} not found`;
            return res.status(errors["404.2"].code).send(errors["404.2"]);
        }
        return res.status(201).send(getShortenUrlQuery.rows[0]);
    });
    return;
}


async function openShortUrl(req, res) {
    const { shortUrl } = req.params;
    if (!shortUrl || typeof shortUrl !== "string" || shortUrl.length !== 10) {
        errors[409].message = "invalid shortUrl param";
        return res.status(errors[409].code).send(errors[409]);
    }
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        const getShortenUrlQuery = await getPostgresClient().query("SELECT \"id\", \"original_url\" FROM \"shorten_urls\" WHERE \"shorten_url\" = $1;", [shortUrl]);
        if (getShortenUrlQuery.rows.length === 0) {
            releaseClient();
            errors["404.2"].message = `shorten url ${shortUrl} not found`;
            return res.status(errors["404.2"].code).send(errors["404.2"]);
        }
        await getPostgresClient().query("INSERT INTO \"shorten_urls_visits\" (\"ip_address\", \"user_agent\", \"shorten_url_id\") VALUES ($1, $2, $3);", [req.socket.remoteAddress, req.headers["user-agent"], getShortenUrlQuery.rows[0].id]);
        releaseClient();
        return res.redirect(getShortenUrlQuery.rows[0].original_url);
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

export { deleteShortUrl, getShortUrl, openShortUrl, shortUrl };