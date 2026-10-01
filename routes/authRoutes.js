import express from "express";
import { registerUser, loginUser } from "../controllers/authControllers.js";
import { validateRegister, validateLogin } from "../middleware/validationMiddleware.js";

const router = express.Router();

// We inject the validation middleware right before the controllers
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;