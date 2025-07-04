"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const path_1 = __importDefault(require("path"));
class HomeController {
    welcome(req, res) {
        res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
    }
}
exports.HomeController = HomeController;
