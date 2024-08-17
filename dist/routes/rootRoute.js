"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = __importDefault(require("./authRoute"));
const projectRoute_1 = __importDefault(require("./projectRoute"));
const taskRoute_1 = __importDefault(require("./taskRoute"));
const userRoute_1 = __importDefault(require("./userRoute"));
const rootRouter = (0, express_1.Router)();
rootRouter.use('/auth', authRoute_1.default);
rootRouter.use('/projects', projectRoute_1.default);
rootRouter.use('/tasks', taskRoute_1.default);
rootRouter.use('/users', userRoute_1.default);
exports.default = rootRouter;
