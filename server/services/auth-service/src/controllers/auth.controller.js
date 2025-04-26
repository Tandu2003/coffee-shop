const { bcryptHash, bcryptCompare } = require("../config/bcryptjs");
const Account = require("../models/account.model");
const sendVerificationEmail = require("../config/nodemailer");
const { generateToken, verifyToken } = require("../config/jwt");

class AuthController {
  // [GET] /api/auth
  getAuth(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        return res.status(200).json({ loggedIn: true, user: decoded });
      }
    }
    return res.status(400).json({ loggedIn: false });
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
    try {
      const { identifier, password, remember } = req.body;

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

      const user = {
        _id: existingAccount._id,
        username: existingAccount.username,
        email: existingAccount.email,
        isAdmin: existingAccount.isAdmin,
      };

      const token = generateToken(user);

      return res.status(200).json({
        loggedIn: true,
        user,
        token,
        message: "Successful login ><",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // [POST] /api/auth/logout
  postLogout(req, res) {
    res.status(200).json({ message: "Logged out successfully" });
  }
}

module.exports = new AuthController();
