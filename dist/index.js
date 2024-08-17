"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const internal_1 = require("./internal");
const port = internal_1.PORT !== null && internal_1.PORT !== void 0 ? internal_1.PORT : 8000;
app_1.default.listen(port, () => {
    console.log(`App is working on port ${port}`);
});
