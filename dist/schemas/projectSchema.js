"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProject = exports.projectSchema = void 0;
const zod_1 = require("zod");
exports.projectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    description: zod_1.z.string().optional(),
});
const validateProject = (req, res, next) => {
    try {
        exports.projectSchema.parse(req.body);
        next();
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: e.errors });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validateProject = validateProject;
