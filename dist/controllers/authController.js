"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.logout = exports.register = exports.getUserLogin = exports.login = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const internal_1 = require("../internal");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, internal_1.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});
exports.login = login;
const getUserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, internal_1.JWT_SECRET);
        const user = yield prismaClient_1.default.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ email: user.email, id: user.id });
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});
exports.getUserLogin = getUserLogin;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, password_confirmation, username } = req.body;
    if (password !== password_confirmation) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prismaClient_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            username,
        },
    });
    const token = jwt.sign({ userId: user.id }, internal_1.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
});
exports.register = register;
const logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
