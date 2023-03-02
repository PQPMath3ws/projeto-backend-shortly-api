import bcrypt from "bcrypt";
import jws from "jws";

import { getPostgresClient, openPostgresClient, releaseClient } from "../config/database.js";
import errors from "../const/errors.js";
import { secretJwtKey } from "../const/jwt.js";
import { validateUser } from "../schemas/user.js";

async function signIn(req, res) {
    let { email, password } = req.body;
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        errors[422].message = `invalid or missing body arguments`;
        return res.status(errors[422].code).send(errors[422]);
    }
    await openPostgresClient(async (error) => {
        if (error) return res.status(errors[500].code).send(errors[500]);
        try {
            const findUserQuery = await getPostgresClient().query("SELECT * FROM \"users\" WHERE \"email\" = $1;", [email]);
            if (findUserQuery.rows.length === 0) {
                releaseClient();
                return res.status(errors[401].code).send(errors[401]);
            }
            if (!await bcrypt.compare(password, findUserQuery.rows[0].password)) {
                releaseClient();
                return res.status(errors[401].code).send(errors[401]);
            }
            const token = jws.sign({ header: { alg: 'HS256' }, payload: { name: findUserQuery.rows[0].name, email: findUserQuery.rows[0].email, }, secret: secretJwtKey });
            let date = new Date();
            date.setDate(date.getDate() + 2);
            await getPostgresClient().query("INSERT INTO \"authentications\" (\"token\", \"expire_date\", \"user_id\") VALUES ($1, $2, $3);", [token, date, findUserQuery.rows[0].id]);
            releaseClient();
            return res.status(200).send({ token });
        } catch (_) {
            console.log(_);
            return res.status(errors[500].code).send(errors[500]);
        }
    });
    return;
}

async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
        errors[422].message = `invalid or missing body arguments`;
        return res.status(errors[422].code).send(errors[422]);
    }
    if (password !== confirmPassword) {
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
            await getPostgresClient().query("INSERT INTO \"users\" (\"name\", \"email\", \"password\") VALUES ($1, $2, $3);", [user.name,  user.email, await bcrypt.hash(user.password, salt)]);
            releaseClient();
            return res.status(201).send({code: 201, message: "user created successfully"});
        }
        catch (_) {
            return res.status(errors[500].code).send(errors[500]);
        }
    });
    return;
}

export { signIn, signUp };