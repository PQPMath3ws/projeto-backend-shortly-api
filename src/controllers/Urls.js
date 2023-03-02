import { customAlphabet } from "nanoid/async";
import isUrl from "is-url";

import { getPostgresClient, openPostgresClient, releaseClient } from "../config/database.js";
import errors from "../const/errors.js";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 10);

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

export { shortUrl };