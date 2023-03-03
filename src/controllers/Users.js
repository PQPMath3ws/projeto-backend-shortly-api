import { getPostgresClient, openPostgresClient, releaseClient } from "../config/database.js";
import errors from "../const/errors.js";

async function getUserInfo(req, res) {
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        const userInfoQuery = await getPostgresClient().query("SELECT \"id\", \"name\" FROM \"users\" WHERE \"id\" = $1;", [Number(req.authentication.user_id)]);
        const shortnedUrlsQuery = await getPostgresClient().query("SELECT \"shorten_urls\".\"id\", \"shorten_url\" AS \"shortUrl\", \"original_url\" AS \"url\", SUM((CASE WHEN \"shorten_urls_visits\".\"id\" IS NOT NULL THEN 1 ELSE 0 END)) AS \"visitCount\" FROM \"shorten_urls\" LEFT JOIN \"shorten_urls_visits\" ON \"shorten_urls_visits\".\"shorten_url_id\" = \"shorten_urls\".\"id\" WHERE \"user_id\" = $1 GROUP BY \"shorten_urls\".\"id\" ORDER BY \"shorten_urls\".\"id\" ASC;", [userInfoQuery.rows[0].id]);
        releaseClient();
        const userMe = {
            ...userInfoQuery.rows[0],
            visitCount: shortnedUrlsQuery.rows.reduce((a, b) => a + Number(b.visitCount), 0),
            shortenedUrls: shortnedUrlsQuery.rows,
        };
        return res.status(200).send(userMe);
    });
    return;
}

export { getUserInfo };