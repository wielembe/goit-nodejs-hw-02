const notFoundResponse = (res, message, _) => {
    res.status(404).json({
        status: "failure",
        code: 404,
        message: message,
    });
};

const badReqResponse = (res, message, _) => {
    res.status(400).json({
        status: "failure",
        code: 400,
        message: message,
    });
};

const unauthorizedResponse = (res, message, _) => {
    res.status(401).json({
        status: "failure",
        code: 401,
        message: message,
    });
};

const errorResponse = (res, message, _) => {
    console.log(message);
    res.status(500).json({
        status: "failure",
        code: 500,
        message: message,
    });
};

module.exports = {
    notFoundResponse,
    errorResponse,
    badReqResponse,
    unauthorizedResponse,
};
