"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const avatar = req.file ? `/storage/images/${req.file.filename}` : undefined;
    try {
        const user = yield prismaClient_1.default.user.create({
            data: {
                username,
                email,
                password,
                avatar,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});
exports.createUser = createUser;
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prismaClient_1.default.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prismaClient_1.default.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const avatar = req.file ? `/storage/images/${req.file.filename}` : undefined;
    try {
        const user = yield prismaClient_1.default.user.update({
            where: { id },
            data: {
                username,
                email,
                password,
                avatar,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prismaClient_1.default.user.delete({
            where: { id },
        });
        if (user.avatar) {
            const filePath = path_1.default.join(__dirname, '../..', user.avatar);
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error('Failed to delete avatar:', err);
                }
            });
        }
        res.status(204).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
exports.deleteUser = deleteUser;
