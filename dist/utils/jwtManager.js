"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const encoding = process.env.TOKEN;
const jwt = require('jsonwebtoken');
function createToken(payload) {
    return jwt.sign(payload, encoding, { expiresIn: '24h' });
}
function verifyToken(token) {
    return jwt.verify(token, encoding);
}
