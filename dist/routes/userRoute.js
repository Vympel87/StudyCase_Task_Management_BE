"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userSchema_1 = require("../schemas/userSchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middlewares/uploadMiddleware"));
const userRoutes = (0, express_1.Router)();
userRoutes.post('/', authMiddleware_1.authenticate, uploadMiddleware_1.default.single('avatar'), userSchema_1.validateUser, userController_1.createUser);
userRoutes.get('/', authMiddleware_1.authenticate, userController_1.getUsers);
userRoutes.get('/:id', authMiddleware_1.authenticate, userController_1.getUserById);
userRoutes.put('/:id', authMiddleware_1.authenticate, uploadMiddleware_1.default.single('avatar'), userSchema_1.validateUser, userController_1.updateUser);
userRoutes.delete('/:id', authMiddleware_1.authenticate, userController_1.deleteUser);
exports.default = userRoutes;
