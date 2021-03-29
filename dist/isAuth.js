"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, _, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error("Not Authenticated");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new Error("Not Authenticated");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.userId = payload.userId;
        next();
        return;
    }
    catch (_a) { }
    throw new Error("Not Authenticated");
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map