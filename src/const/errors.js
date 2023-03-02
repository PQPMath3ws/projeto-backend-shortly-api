const setError = (code, message) => ({code, message});

const errors = {
    404.1: setError(404, "route not found in server API"),
    405: setError(405, "method not allowed"),
    409: setError(409, ""),
    422: setError(422, ""),
    500: setError(500, "internal server error"),
};

export default errors;