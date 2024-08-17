"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const rootRoute_1 = __importDefault(require("./routes/rootRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/storage/images', express_1.default.static(path_1.default.join(__dirname, '../storage/images')));
app.use('/api', rootRoute_1.default);
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
