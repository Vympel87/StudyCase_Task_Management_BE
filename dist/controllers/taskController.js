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
exports.getTaskById = exports.getTasks = exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const taskSchema_1 = require("../schemas/taskSchema");
const zod_1 = require("zod");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        return res.status(401).json({ error: 'User not authenticated' });
    try {
        taskSchema_1.taskSchema.parse(req.body);
        const { title, description, status, projectName } = req.body;
        const projectId = yield getProjectIdByName(projectName);
        if (!projectId)
            return res.status(404).json({ error: 'Project not found' });
        const task = yield prismaClient_1.default.task.create({
            data: {
                title,
                description,
                status,
                userId,
                projectId,
            },
        });
        res.status(201).json(task);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create task' });
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        return res.status(401).json({ error: 'User not authenticated' });
    try {
        taskSchema_1.taskSchema.parse(req.body);
        const { title, description, status, projectName } = req.body;
        const projectId = yield getProjectIdByName(projectName);
        if (!projectId)
            return res.status(404).json({ error: 'Project not found' });
        const task = yield prismaClient_1.default.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                userId,
                projectId,
            },
        });
        res.status(200).json(task);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to update task' });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prismaClient_1.default.task.delete({
            where: { id },
        });
        res.status(204).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});
exports.deleteTask = deleteTask;
const getTasks = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield prismaClient_1.default.task.findMany({
            include: { user: true, project: true },
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});
exports.getTasks = getTasks;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield prismaClient_1.default.task.findUnique({
            where: { id },
            include: { user: true, project: true },
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});
exports.getTaskById = getTaskById;
const getProjectIdByName = (projectName) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prismaClient_1.default.project.findFirst({
        where: { name: projectName },
    });
    return project ? project.id : null;
});
