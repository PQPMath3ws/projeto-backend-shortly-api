const setError = (code, message) => ({code, message});

const errors = {
    401.1: setError(401, "invalid email and/or password"),
    401.2: setError(401, "invalid header authorization token"),
    401.3: setError(401, "you not able to delete this shorten URL"),
    404.1: setError(404, "route not found in server API"),
    404.2: setError(404, ""),
    405: setError(405, "method not allowed"),
    409: setError(409, ""),
    422: setError(422, ""),
    500: setError(500, "internal server error"),
};

export default errors;