import bcrypt from "bcrypt";

import { getPostgresClient, openPostgresClient, releaseClient } from "../config/database.js";
import errors from "../const/errors.js";
import { validateUser } from "../schemas/user.js";

async function signUp(req, res) {
    const { name, email, password, passwordConfirmation } = req.body;
    if (!name || !email || !password || !passwordConfirmation) {
        errors[422].message = `invalid or missing body arguments`;
        return res.status(errors[422].code).send(errors[422]);
    }
    if (password !== passwordConfirmation) {
        errors[422].message = "\"password\" and \"confirmationPassword\" are different";
        return res.status(errors[422].code).send(errors[422]);
    }
    const user = {
        name,
        email,
        password,
    };
    const userValidation = await validateUser(user);
    if (userValidation.status !== "ok") {
        errors[422].message = userValidation.message;
        return res.status(errors[422].code).send(errors[422]);
    }
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        try {
            const findEmailQuery = await getPostgresClient().query("SELECT \"email\" FROM \"users\" WHERE \"email\" = $1;", [user.email]);
            if (findEmailQuery.rows.length > 0) {
                releaseClient();
                errors[409].message = "failed to register this user";
                return res.status(errors[409].code).send(errors[409]);
            }
            const salt = 12;
            await getPostgresClient().query("INSERT INTO \"users\" (\"name\", \"email\", \"password\") VALUES ($1, $2, $3);", [user.name,  user.email, bcrypt.hash(user.password, salt)]);
            releaseClient();
            return res.status(201).send({code: 201, message: "user created successfully"});
        }
        catch (_) {
            return res.status(errors[500].code).send(errors[500]);
        }
    });
    return;
}

export { signUp };