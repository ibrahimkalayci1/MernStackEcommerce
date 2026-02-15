import express from "express"
import { forgotPassword, userDetail,login, logout, register, resetPassword, updateRole } from "../controllers/user.js";
import { authenticationMid } from "../middleware/auth.js";

const router =express.Router()


router.post("/register",register);
router.post("/login",login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword)
router.post("/reset/:token", resetPassword)
router.get("/me",   authenticationMid, userDetail)
router.put("/user/:id/role", updateRole) // Role güncelleme endpoint'i (güvenlik için authentication eklenebilir)



export default router