import jws from "jws";

import { getPostgresClient, openPostgresClient, releaseClient } from "../config/database.js";
import errors from "../const/errors.js";
import { secretJwtKey } from "../const/jwt.js";

async function isAuthenticated(req, res, next) {
    let { authorization } = req.headers;
    if (!authorization || typeof authorization !== "string") return res.status(errors["401.2"].code).send(errors["401.2"]);
    if (!authorization.includes("Bearer")) return res.status(errors["401.2"].code).send(errors["401.2"]);
    authorization = authorization.replace("Bearer ", "");
    if (!jws.verify(authorization, "HS256", secretJwtKey)) return res.status(errors["401.2"].code).send(errors["401.2"]);
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        const authenticationQuery = await getPostgresClient().query("SELECT * FROM \"authentications\" WHERE \"token\" = $1;", [authorization]);
        releaseClient();
        if (authenticationQuery.rows.length === 0) return res.status(errors["401.2"].code).send(errors["401.2"]);
        const diffDates = Math.abs(new Date(authenticationQuery.rows[0].expire_date) - new Date());
        if (diffDates <= 0) return res.status(errors["401.2"].code).send(errors["401.2"]);
        req.authentication = authenticationQuery.rows[0];
        return next();
    });
    return;
}

export { isAuthenticated };