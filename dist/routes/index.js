"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HomePage_1 = require("../aplication/HomePage");
const express_1 = require("express");
const routes = (0, express_1.Router)();
const homepage = new HomePage_1.HomeController();
routes.get('/', homepage.welcome);
exports.default = routes;
