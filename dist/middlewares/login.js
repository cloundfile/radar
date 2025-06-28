"use strict";
const jwt = require('jsonwebtoken');
exports.required = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.TOKEN);
        req.usuario = decode;
        next();
    }
    catch (error) {
        return res.status(401).send({ message: "Unauthorized!" });
    }
};
exports.optional = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.TOKEN);
        req.usuario = decode;
        next();
    }
    catch (error) {
        next();
    }
};
