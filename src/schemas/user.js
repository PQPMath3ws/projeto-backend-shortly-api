import Joi from "joi";

const UserSchema = Joi.object({
    name: Joi.string().min(3).max(60).required(),
    email: Joi.string().min(12).max(60).email().regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).required(),
    password: Joi.string().min(8).max(50).required(),
});

async function validateUser(user) {
    try {
        await UserSchema.validateAsync(user);
        return {
            status: "ok",
            message: "user validated successfully",
        };
    } catch (error) {
        return {
            status: "error",
            message: error.details[0].message,
        };
    }
}

export { validateUser };