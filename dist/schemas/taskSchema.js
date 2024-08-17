"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTask = exports.taskSchema = void 0;
const zod_1 = require("zod");
exports.taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['pending', 'in_progress', 'completed']),
    projectName: zod_1.z.string().min(1, 'Project name is required'),
});
const validateTask = (req, res, next) => {
    try {
        exports.taskSchema.parse(req.body);
        next();
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: e.errors });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validateTask = validateTask;
