const router = require("express").Router();
const User = require("../models/User");
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")
const nodeMailer = require("nodemailer")
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
        ).toString(),
    });

    let transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_FROM,
            pass: process.env.MAIL_PASSWORD,
        }
    })

    let token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });


    const verificationLink =  `https://nodejs-server-1-o4q8.onrender.com/api/auth/verifyEmail?token=${token}`;
    let mailOptions = {
        from: process.env.MAIL_FROM,
        to: newUser.email,
        subject: "Email Verification",
        text: `Click on the link to verify your email: ${verificationLink}\n This link will expire in 1 hour.`,
    }
    try {
        const user = await newUser.save();
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(user);
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/forgotPassword", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json("Email not found");
        }

        let transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_FROM,
                pass: process.env.MAIL_PASSWORD,
            }
        });

        let token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });

        const verificationLink = `https://nodejs-server-1-o4q8.onrender.com/api/auth/resetPassword?token=${token}&newPassword=${req.body.password}`;
        let mailOptions = {
            from: process.env.MAIL_FROM,
            to: req.body.email,
            subject: "Reset Password",
            text: `Click on the link to reset your password: ${verificationLink}\nThis link will expire in 1 hour.`,
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.status(200).json({ message: "Email sent successfully" });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

router.get("/verifyEmail", async (req, res) => {
    const token = req.query.token;
    try {
        const decodedMail = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ email: decodedMail.email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        user.verify = true;
        await user.save();

        res.status(200).json("Send successfully");
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get("/resetPassword", async (req, res) => {
    const token = req.query.token;
    const newPassword = req.query.newPassword;
    const encryptionPassWord = CryptoJS.AES.encrypt(
        newPassword,
        process.env.SECRET_KEY
    ).toString();
    try {
        const decodedMail = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ email: decodedMail.email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        try {
            const newUser = await User.findByIdAndUpdate(
                user._id,
                { password: encryptionPassWord }
            )
            res.status(200).json("Send Successfully");
        } catch (err) {
            res.status(500).json(err);
        }

    } catch (err) {
        res.status(500).json(err);
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(401).json("Wrong password or username!")
        }
        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        
        if (originalPassword !== req.body.password) {
            return res.status(401).json("Wrong password or username!")
        }

        
        if (user.verify !== true) {
            return res.status(500).json("You don't authetication");
        }
    
        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "100d" }
        )
        
        const { password, ...info } = user._doc;

        res.status(200).json({ ...info, accessToken })
    } catch (err) {
        res.status(500).json(err)
    }
})

router.post("/loginAI", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        })
        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "100d" }
        )
        
        const { password, ...info } = user._doc;

        res.status(200).json({ ...info, accessToken });
    } catch(err) {
        res.status(500).json(err);
    }
})
module.exports = router;
