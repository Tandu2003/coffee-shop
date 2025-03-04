const { bcryptHash, bcryptCompare } = require("../config/bcryptjs");
const Account = require("../models/account.model");
const sendVerificationEmail = require("../config/nodemailer");

class AuthController {
  // [GET] /api/auth
  getAuth(req, res) {
    if (req.session.user) {
      res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
      res.status(400).json({ loggedIn: false });
    }
  }

  // [POST] /api/auth/register
  async postRegister(req, res) {
    let { username, email, password } = req.body;
    username = username?.trim().toLowerCase();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    try {
      const [existingUsername, existingEmail] = await Promise.all([
        Account.findOne({ username }),
        Account.findOne({ email }),
      ]);

      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashPassword = await bcryptHash(password, res);
      const newAccount = new Account({
        username,
        email,
        password: hashPassword,
      });

      sendVerificationEmail(newAccount, res);

      await newAccount.save();

      return res.status(200).json({
        message: "Account created successfully! Please verify your email to login",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // [POST] /api/auth/login
  async postLogin(req, res) {
    let { identifier, password, remember = false } = req.body;
    identifier = identifier?.trim().toLowerCase();
    password = password?.trim();

    try {
      const existingAccount = await Account.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!existingAccount) {
        return res.status(400).json({ message: "Account does not exist" });
      }

      const isMatch = await bcryptCompare(password, existingAccount.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password :<" });
      }

      if (!existingAccount.verified) {
        return res.status(400).json({
          message: "You have not verified your email. Please check your mailbox!!!",
        });
      }

      if (remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }

      req.session.user = {
        _id: existingAccount._id,
        username: existingAccount.username,
        email: existingAccount.email,
        isAdmin: existingAccount.isAdmin,
      };

      return res.status(200).json({
        loggedIn: true,
        user: req.session.user,
        message: "Successful login ><",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // [POST] /api/auth/logout
  postLogout(req, res) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
      res.clearCookie("userId");
      return res.status(200).json({ message: "Logout success!!!" });
    });
  }
}

module.exports = new AuthController();
