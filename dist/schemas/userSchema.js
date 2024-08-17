"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, 'Username is required'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
    avatar: zod_1.z.string().optional(),
});
const validateUser = (req, res, next) => {
    try {
        exports.userSchema.parse(req.body);
        next();
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: e.errors });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validateUser = validateUser;
