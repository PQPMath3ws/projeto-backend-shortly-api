import { getPostgresClient, openPostgresClient, releaseClient } from "../config/database.js";
import errors from "../const/errors.js";

async function getRanking(req, res) {
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        const rankingUsersQuery = await getPostgresClient().query("SELECT \"users\".\"id\", \"name\", SUM((CASE WHEN \"shorten_urls\".\"id\" IS NOT NULL THEN 1 ELSE 0 END)) AS \"linksCount\", SUM((CASE WHEN \"shorten_urls_visits\".\"id\" IS NOT NULL THEN 1 ELSE 0 END)) AS \"visitCount\" FROM \"users\" LEFT JOIN \"shorten_urls\" ON \"shorten_urls\".\"user_id\" = \"users\".\"id\" LEFT JOIN \"shorten_urls_visits\" ON \"shorten_urls_visits\".\"shorten_url_id\" = \"shorten_urls\".\"id\" GROUP BY \"users\".\"id\" ORDER BY \"visitCount\" DESC LIMIT 10;");
        releaseClient();
        return res.status(200).send(rankingUsersQuery.rows);
    });
}

export { getRanking };