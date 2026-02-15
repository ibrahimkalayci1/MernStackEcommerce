import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const authenticationMid = async (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.trim() === "") {
      return res.status(500).json({ message: "Sunucu yapılandırma hatası (JWT)" });
    }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token yok" });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ message: "Token geçersiz" });
    }

    const decodedData = jwt.verify(token, secret);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

export const roleChecked = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }
    next();
  };
};
