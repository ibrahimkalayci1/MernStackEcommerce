import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import crypto from "crypto";
import nodemailer from "nodemailer";




export const register = async (req, res) => {
    const avatarSource = typeof req.body.avatar === "string"
      ? req.body.avatar
      : req.body.avatar?.url ?? req.body.avatar?.base64 ?? req.body.avatar;
    if (!avatarSource || typeof avatarSource !== "string") {
      return res.status(400).json({ message: "Avatar (resim) gerekli" });
    }
    const avatar = await cloudinary.uploader.upload(avatarSource, {
      folder: "avatars",
      width: 130,
      crop: "scale",
    });

    const { name, email, password, role } = req.body;
  
  
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Böyle bir kullanıcı zaten var !!!" });
    }
  
    if (password.length < 6) {
      return res.status(400).json({ message: "Şifre 6 karakterden küçük olamaz!!!" });
    }
  
    const passwordHash = await bcrypt.hash(password, 10);
  
    // İlk kullanıcıyı otomatik admin yap, sonrakiler user veya request'ten gelen role
    const userCount = await User.countDocuments();
    const userRole = userCount === 0 ? "admin" : (role || "user");
  
    const newUser = await User.create({
        name,
        email,
        password: passwordHash,
        avatar: {
          public_id: avatar.public_id,
          url: avatar.secure_url
        },
        role: userRole
      });
      
  
    // JWT_EXPIRE formatını parse et (örn: "7d" -> 7 gün)
    const expireDays = parseInt(process.env.JWT_EXPIRE) || 7;
    const jwtExpire = `${expireDays}d`;
    
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: jwtExpire }
    );
    newUser.password = undefined;


    const cookieOptions = {
        httpOnly: true,
        expires: new Date(
          Date.now() + expireDays * 24 * 60 * 60 * 1000
        ),
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      };
      
      

    res.status(201).cookie("token",token,cookieOptions).json({
      newUser,
      token
    });
  };
  

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Böyle bir kullanıcı bulunamadı !!!" });
      }
  
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.status(401).json({ message: "Yanlış şifre girdiniz" });
      }
  
      // JWT_EXPIRE formatını parse et (örn: "7d" -> 7 gün)
      const expireDays = parseInt(process.env.JWT_EXPIRE) || 7;
      const jwtExpire = `${expireDays}d`;
      
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: jwtExpire }
      );
  
      user.password = undefined;
  
      const cookieOptions = {
        httpOnly: true,
        expires: new Date(
          Date.now() + expireDays * 24 * 60 * 60 * 1000
        ),
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      };
  
      res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json({
          user,
          token
        });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  




export const logout = async(req,res) =>{
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(
          Date.now()   ),
      };
res.status(200).cookie("token",null, cookieOptions ).json({
    message:"Çıkış işlemi başarılı !!"
})
}

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "Böyle bir kullanıcı bulunamadı" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const passwordUrl = `${frontendUrl}/reset/${resetToken}`;

    const message = `Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:\n\n${passwordUrl}`;

    // ✅ Mailtrap transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"Reset Password" <no-reply@test.com>',
      to: user.email,
      subject: "Şifre sıfırlama",
      text: message
    });

    res.status(200).json({
      message: "Şifre sıfırlama maili gönderildi"
    });

  } catch (error) {
    console.log(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      message: "Mail gönderilirken hata oluştu"
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Geçersiz veya süresi dolmuş token" });
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ message: "Şifre en az 6 karakter olmalı" });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    user.password = passwordHash;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ),
    };

    res.status(200).cookie("token", token, cookieOptions).json({
      user,
      token,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Şifre sıfırlanırken bir hata oluştu" });
  }
}; 

export const userDetail = async(req,res,next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    user
  })
}

export const updateRole = async(req,res,next) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Geçerli bir role giriniz (user veya admin)" });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    
    res.status(200).json({
      message: "Role başarıyla güncellendi",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


// dk 02.13